import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "tm-sheet",
  templateUrl: "./sheet.component.html",
  styleUrls: ["./sheet.component.scss"]
})
export class SheetComponent implements OnInit {
  @Input() sheetDetails: any;
  editable = {};

  constructor() {}

  ngOnInit() {}

  onCurrentYearEditClick(evt, houseId, taxId) {
    evt.preventDefault();
    this.makeCurrentYearEditable(houseId, taxId, true);
  }
  onCurrentYearKeyPress(evt, sheetId, houseId, taxId) {
    if (evt.keyCode == 13) {
      evt.preventDefault();
      this.makeCurrentYearEditable(houseId, taxId, false);
    }
  }
  onCurrentYearBlur(evt, sheetId, houseId, taxId) {
    this.makeCurrentYearEditable(houseId, taxId, false);
  }
  onPaidAmountEditClick(evt, houseId, taxId) {
    evt.preventDefault();
    this.makePaidAmountEditable(houseId, taxId, true);
  }
  onPaidAmountKeyPress(evt, sheetId, houseId, taxId) {
    if (evt.keyCode == 13) {
      evt.preventDefault();
      this.makePaidAmountEditable(houseId, taxId, false);
    }
  }
  onPaidAmountBlur(evt, sheetId, houseId, taxId) {
    this.makePaidAmountEditable(houseId, taxId, false);
  }
  makeCurrentYearEditable(houseId, taxId, editable) {
    this.sheetDetails.balanceSheet[houseId].taxes[
      taxId
    ].currentYearEditable = editable;
  }
  makePaidAmountEditable(houseId, taxId, editable) {
    this.sheetDetails.balanceSheet[houseId].taxes[
      taxId
    ].paidAmountEditable = editable;
  }
}
