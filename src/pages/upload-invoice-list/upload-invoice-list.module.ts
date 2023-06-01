import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UploadInvoiceListPage } from './upload-invoice-list';

@NgModule({
  declarations: [
    UploadInvoiceListPage,
  ],
  imports: [
    IonicPageModule.forChild(UploadInvoiceListPage),
  ],
})
export class UploadInvoiceListPageModule {}
