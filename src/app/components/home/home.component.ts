import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { AuthService } from "../../services/auth/auth.service";
import { NgFlashMessageService } from "ng-flash-messages";
import { MessagingService } from "../../services/messaging/messaging.service";

declare var $: any;

@Component({
  selector: "tm-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  sheets: Array<any> = [];
  sheetDetails: any = {};
  frmSheetDetails: FormGroup;
  frmTaxDetails: FormGroup;
  sheetLoading: boolean = true;

  constructor(
    private auth: AuthService,
    private flash: NgFlashMessageService,
    private messaging: MessagingService
  ) {}

  ngOnInit() {
    this.auth.get("sheets").then(result => {
      if (!result.err) {
        this.sheets = result.sheets;
        // Load the last sheet available
        if (this.sheets.length >= 1) {
          this.loadSheet(this.sheets[this.sheets.length - 1].id);
        }
      }
    });
    this.frmSheetDetails = new FormGroup({
      fromYear: new FormControl("", Validators.required),
      toYear: new FormControl("", Validators.required)
    });
    this.frmTaxDetails = new FormGroup({
      taxName: new FormControl("", Validators.required)
    });
    this.messaging.on("house-search", message => {
      if (this.sheetDetails.id) {
        this.loadSheet(this.sheetDetails.id, message);
      }
    });
    this.messaging.on("reload-sheets", message => {
      this.loadSheet(this.sheetDetails.id);
    });
  }

  onSelectedSheetChange(evt) {
    if (evt.target.selectedIndex != -1) {
      const sheetId = evt.target.options[evt.target.selectedIndex].value;
      this.loadSheet(sheetId);
    }
  }

  loadSheet(id: string, query: string = null) {
    let sheet: any = {};
    let blanceSheet = {};
    let url = "";
    if (query != null) {
      url = `sheets/${id}?query=${query}`;
    } else {
      url = `sheets/${id}`;
    }
    this.sheetLoading = true;
    this.auth.get(url).then(result => {
      if (!result.error) {
        this.sheetLoading = false;
        sheet.id = result.sheet.id;
        // Set the list of available taxes
        sheet.availableTaxes = result.sheet.availableTaxes;
        // Set the houses
        sheet.availableHouses = result.sheet.availableHouses;
        sheet.availableHouses.forEach(availableHouse => {
          blanceSheet[availableHouse.id] = {
            owner_name: availableHouse.owner_name,
            taxes: {}
          };
        });

        result.sheet.currentBalanceSheet.forEach(details => {
          blanceSheet[details.house_id].taxes[details.tax_id] = {
            name: details.tax,
            currentYear: details.amount,
            paidAmount: details.paid_amount
          };
        });

        result.sheet.previousBalanceSheet.forEach(details => {
          if (blanceSheet[details.house_id].taxes[details.tax_id]) {
            blanceSheet[details.house_id].taxes[details.tax_id].previousYear =
              details.balance;
          } else {
            blanceSheet[details.house_id].taxes[details.tax_id] = {
              name: details.tax,
              previousYear: details.balance
            };
          }
        });
        sheet.balanceSheet = blanceSheet;
        this.sheetDetails = sheet;
      }
    });
  }
  get toYear() {
    return this.frmSheetDetails.get("toYear");
  }
  get fromYear() {
    return this.frmSheetDetails.get("fromYear");
  }
  get taxName() {
    return this.frmTaxDetails.get("taxName");
  }
  onBtnSaveSheetClick(evt) {
    this.auth
      .post("sheets", {
        fromYear: this.fromYear.value,
        toYear: this.toYear.value
      })
      .then(result => {
        $("#modal-sheet-details").modal("hide");
        this.frmSheetDetails.reset();
      })
      .catch(err => {
        $("#modal-sheet-details").modal("hide");
        this.flash.showFlashMessage({
          type: "danger",
          dismissible: true,
          messages: ["Error creating the sheet"]
        });
      });
  }
  onBtnSaveTaxClick(evt) {
    this.auth
      .post("taxes", { taxName: this.taxName.value })
      .then(result => {
        if (!result.err) {
          $("#modal-tax-details").modal("hide");
          this.frmTaxDetails.reset();
        }
      })
      .catch(err => {
        $("#modal-tax-details").modal("hide");
        this.flash.showFlashMessage({
          type: "danger",
          dismissible: true,
          messages: ["Error creating the tax"]
        });
      });
  }
  onBtnNewHouseClick(evt) {
    evt.preventDefault();
    this.messaging.emit("new-house", "");
  }
}
