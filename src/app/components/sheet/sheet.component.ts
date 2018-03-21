import { Component, OnInit, Input } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { AuthService } from "../../services/auth/auth.service";
import { NgFlashMessageService } from "ng-flash-messages";
import { MessagingService } from "../../services/messaging/messaging.service";

declare var $: any;

@Component({
  selector: "tm-sheet",
  templateUrl: "./sheet.component.html",
  styleUrls: ["./sheet.component.scss"]
})
export class SheetComponent implements OnInit {
  @Input() sheetDetails: any;
  @Input() loading: boolean;
  editable = {};
  frmHouseDetails: FormGroup;
  // To check whether the form is used for insertion or updation
  frmHouseDetailsAction = { operation: "", houseId: "" };

  constructor(
    private auth: AuthService,
    private flash: NgFlashMessageService,
    private messaging: MessagingService
  ) {}

  ngOnInit() {
    this.frmHouseDetails = new FormGroup({
      ownerName: new FormControl("", Validators.required),
      houseNumber: new FormControl("", Validators.required)
    });
    this.messaging.on("new-house", () => {
      this.frmHouseDetailsAction.operation = "insert";
      $("#modal-house-details").modal("show");
    });
  }

  onHouseDetailsEditClick(evt) {
    evt.preventDefault();
    const houseId = evt.target.getAttribute("data-house-id");
    // Get the house details to poulate in the form
    this.auth.get(`houses/${houseId}`).then(result => {
      if (!result.error) {
        this.ownerName.setValue(result.house.owner_name);
        this.houseNumber.setValue(result.house.house_number);
        // Update the formAction
        this.frmHouseDetailsAction.operation = "update";
        this.frmHouseDetailsAction.houseId = houseId;
        // Show the modal
        $("#modal-house-details").modal("show");
      } else {
        this.flash.showFlashMessage({
          type: "danger",
          dismissible: true,
          messages: ["Error getting the house details"]
        });
      }
    });
  }
  parseInt(str) {
    return new Number(str);
  }
  onCurrentYearEditClick(evt, houseId, taxId) {
    evt.preventDefault();
    this.makeCurrentYearEditable(houseId, taxId, true);
  }
  onCurrentYearKeyPress(evt, sheetId, houseId, taxId) {
    if (evt.keyCode == 13) {
      evt.preventDefault();
      this.makeCurrentYearEditable(houseId, taxId, false);
      this.updateCurrentYearAmount(sheetId, houseId, taxId, evt.target.value);
    }
  }
  onCurrentYearBlur(evt, sheetId, houseId, taxId) {
    this.makeCurrentYearEditable(houseId, taxId, false);
    this.updateCurrentYearAmount(sheetId, houseId, taxId, evt.target.value);
  }
  onPaidAmountEditClick(evt, houseId, taxId) {
    evt.preventDefault();
    this.makePaidAmountEditable(houseId, taxId, true);
  }
  onPaidAmountKeyPress(evt, sheetId, houseId, taxId) {
    if (evt.keyCode == 13) {
      evt.preventDefault();
      this.makePaidAmountEditable(houseId, taxId, false);
      this.updatePaidAmount(sheetId, houseId, taxId, evt.target.value);
    }
  }
  onPaidAmountBlur(evt, sheetId, houseId, taxId) {
    this.makePaidAmountEditable(houseId, taxId, false);
    this.updatePaidAmount(sheetId, houseId, taxId, evt.target.value);
  }
  makeCurrentYearEditable(houseId, taxId, editable) {
    this.sheetDetails.balanceSheet[houseId].taxes[
      taxId
    ].currentYearEditable = editable;
    // Update if the editable is being removed
    if (!editable) {
    }
  }
  makePaidAmountEditable(houseId, taxId, editable) {
    this.sheetDetails.balanceSheet[houseId].taxes[
      taxId
    ].paidAmountEditable = editable;
  }
  updateCurrentYearAmount(sheetId, houseId, taxId, amount) {
    this.auth
      .put(`sheets/amount/${sheetId}`, {
        houseId: houseId,
        taxId: taxId,
        amount: amount
      })
      .then(() => {
        this.sheetDetails.balanceSheet[houseId].taxes[
          taxId
        ].currentYear = amount;
      })
      .catch(err => {
        this.flash.showFlashMessage({
          type: "danger",
          dismissible: true,
          messages: ["Error updating the amount"]
        });
      });
  }
  updatePaidAmount(sheetId, houseId, taxId, amount) {
    this.auth
      .put(`sheets/paid/${sheetId}`, {
        houseId: houseId,
        taxId: taxId,
        amount: amount
      })
      .then(() => {
        this.sheetDetails.balanceSheet[houseId].taxes[
          taxId
        ].paidAmount = amount;
      })
      .catch(err => {
        this.flash.showFlashMessage({
          type: "danger",
          dismissible: true,
          messages: ["Error updating the amount"]
        });
      });
  }
  // Getters for form house details
  get ownerName() {
    return this.frmHouseDetails.get("ownerName");
  }
  get houseNumber() {
    return this.frmHouseDetails.get("houseNumber");
  }
  onBtnSaveClick(evt) {
    const params = {
      owner_name: this.ownerName.value,
      house_number: this.houseNumber.value
    };

    if (this.frmHouseDetailsAction.operation == "update") {
      this.auth
        .put(`houses/${this.frmHouseDetailsAction.houseId}`, params)
        .then(result => {
          if (result.error) {
            this.flash.showFlashMessage({
              type: "danger",
              dismissible: true,
              messages: ["Error updating house details"]
            });
          } else {
            const updatedHouse = this.sheetDetails.availableHouses.find(
              availableHouse =>
                availableHouse.id == this.frmHouseDetailsAction.houseId
            );
            updatedHouse.owner_name = params.owner_name;
            $("#modal-house-details").modal("hide");
            this.frmHouseDetails.reset();
          }
        });
    }
    if (this.frmHouseDetailsAction.operation == "insert") {
      this.auth.post(`houses`, params).then(result => {
        if (result.error) {
          this.flash.showFlashMessage({
            type: "danger",
            dismissible: true,
            messages: ["Error inserting house details"]
          });
        } else {
          $("#modal-house-details").modal("hide");
          this.frmHouseDetails.reset();
          this.messaging.emit("reload-sheets", "");
        }
      });
    }
  }
  onCurrentYearAddClick(evt, sheetId, houseId, taxId) {
    evt.preventDefault();
    const tax = this.sheetDetails.availableTaxes.find(
      availableTax => availableTax.id == taxId
    );

    this.auth
      .post(`sheets/${this.sheetDetails.id}/taxes/new`, {
        houseId: houseId,
        taxId: taxId
      })
      .then(result => {
        if (!result.error) {
          this.sheetDetails.balanceSheet[houseId].taxes[
            taxId
          ] = this.initializeTax(tax);
          this.sheetDetails.balanceSheet[houseId].taxes[
            taxId
          ].currentYearEditable = true;
        } else {
          this.flash.showFlashMessage({
            type: "danger",
            dismissible: true,
            messages: ["Error updating the amount"]
          });
        }
      });
  }
  onPaidAmountAddClick(evt, sheetId, houseId, taxId) {
    evt.preventDefault();
    const tax = this.sheetDetails.availableTaxes.find(
      availableTax => availableTax.id == taxId
    );

    this.auth
      .post(`sheets/${this.sheetDetails.id}/taxes/new`, {
        houseId: houseId,
        taxId: taxId
      })
      .then(result => {
        if (!result.error) {
          this.sheetDetails.balanceSheet[houseId].taxes[
            taxId
          ] = this.initializeTax(tax);
          this.sheetDetails.balanceSheet[houseId].taxes[
            taxId
          ].paidAmountEditable = true;
        } else {
          this.flash.showFlashMessage({
            type: "danger",
            dismissible: true,
            messages: ["Error updating the amount"]
          });
        }
      });
  }
  private initializeTax(tax) {
    return {
      name: tax.name,
      previousYear: null,
      currentYear: null,
      paidAmount: null
    };
  }
}
