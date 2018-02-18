import { Component, OnInit } from "@angular/core";

import { AuthService } from "../../services/auth/auth.service";

@Component({
  selector: "tm-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  sheets: Array<any> = [];
  sheetDetails = [];

  constructor(private auth: AuthService) {}

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
  }

  onSelectedSheetChange(evt) {
    if (evt.target.selectedIndex != -1) {
      const sheetId = evt.target.options[evt.target.selectedIndex].value;
      this.loadSheet(sheetId);
    }
  }

  loadSheet(id: string) {
    let sheet = {};
    let availableTaxes = {};

    this.auth.get(`sheets/${id}`).then(result => {
      if (!result.error) {
        // Group all taxes of a home into a single object
        result.sheet.forEach(details => {
          if (!sheet[details.house_id]) {
            sheet[details.house_id] = {};
            sheet[details.house_id].owner_name = details.owner_name;
            sheet[details.house_id].taxes = [];
          }
          sheet[details.house_id].taxes.push({
            tax: details.tax,
            amount: details.amount,
            paidAmount: details.paid_amount
          });
          availableTaxes[details.tax] = true;
        });

        // Convert the object into iterable array
        this.sheetDetails["details"] = [];
        Object.keys(sheet).forEach(houseId => {
          let sheetDetail = sheet[houseId];
          // Add the house id too for reference
          sheetDetail.house_id = houseId;
          this.sheetDetails["details"].push(sheetDetail);
        });
        // Convert available taxes to array
        this.sheetDetails["availableTaxes"] = Object.keys(availableTaxes);
      }
    });
  }
}
