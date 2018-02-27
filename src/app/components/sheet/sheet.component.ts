import { Component, OnInit, Input } from "@angular/core";

import { AuthService } from "../../services/auth/auth.service";
@Component({
  selector: "tm-sheet",
  templateUrl: "./sheet.component.html",
  styleUrls: ["./sheet.component.scss"]
})
export class SheetComponent implements OnInit {
  @Input() sheetDetails: any;
  editable = {};

  constructor(private authService: AuthService) {}

  ngOnInit() {}

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
    this.authService
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
        console.log(err);
      });
  }
  updatePaidAmount(sheetId, houseId, taxId, amount) {
    this.authService
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
        console.log(err);
      });
  }
}
