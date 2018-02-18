import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "tm-sheet",
  templateUrl: "./sheet.component.html",
  styleUrls: ["./sheet.component.scss"]
})
export class SheetComponent implements OnInit {
  @Input() sheetDetails: Object;

  constructor() {}

  ngOnInit() {}
}
