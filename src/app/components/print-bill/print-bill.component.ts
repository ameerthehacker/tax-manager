import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import * as datetime from "date-and-time";

import { AuthService } from "../../services/auth/auth.service";

@Component({
  selector: "tm-print-bill",
  templateUrl: "./print-bill.component.html",
  styleUrls: ["./print-bill.component.scss"]
})
export class PrintBillComponent implements OnInit {
  billDetails: any = {};
  availableTaxes = [];
  panchayatName: string;
  totalAmount: number = 0;
  todayDate: string;
  receiptNumber: string;

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const sheetId = params.sheetId;
      const houseId = params.houseId;
      this.billDetails.house = {};
      this.todayDate = datetime.format(new Date(), "DD/MM/YY");

      if (sheetId && houseId) {
        this.receiptNumber = `${sheetId}${houseId}`;
        this.auth
          .post("sheets/get-bill", {
            sheetId: sheetId,
            houseId: houseId
          })
          .then(result => {
            this.availableTaxes = result.billDetails.availableTaxes;
            this.billDetails.house = result.billDetails.house;
            this.panchayatName = result.panchayatName;
            result.billDetails.previousBalanceSheet.forEach(details => {
              if (!this.billDetails[details.tax_id]) {
                this.billDetails[details.tax_id] = {};
              }
              this.billDetails[details.tax_id].balance = details.balance;
              this.totalAmount += details.balance;
            });
            result.billDetails.currentBalanceSheet.forEach(details => {
              if (!this.billDetails[details.tax_id]) {
                this.billDetails[details.tax_id] = {};
              }
              this.billDetails[details.tax_id].currentAmount = details.amount;
              this.totalAmount += details.amount;
            });

            this.auth.post("sheets/print-bill", {}).then(() => {
              this.router.navigate(["/"]);
            });
          });
      } else {
        // If any of the query param is missing go to home
        this.router.navigate(["/"]);
      }
    });
  }
  parseInt(str) {
    return new Number(str);
  }
}
