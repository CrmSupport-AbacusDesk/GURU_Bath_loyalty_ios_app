import { UploadInvoicePage } from './../upload-invoice/upload-invoice';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';

/**
 * Generated class for the UploadInvoiceListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-upload-invoice-list',
  templateUrl: 'upload-invoice-list.html',
})
export class UploadInvoiceListPage {

  filter :any = {};
  karigar_id:any='';
  image_data2:any=[];



  constructor(public navCtrl: NavController, public navParams: NavParams, public dbService:DbserviceProvider,) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UploadInvoiceListPage');
    // this.showImage();

  }

  goOnAddInvoice(){
    this.navCtrl.push(UploadInvoicePage);
  }
  showImage(){

    this.filter.limit = 0;
  
    this.dbService.onPostRequestDataFromApi( {'filter' : this.filter,'karigar_id': this.dbService.userStorageData.id },'app_karigar/customer_invoice_listing', this.dbService.rootUrl).subscribe( r =>
      {
        console.log(r);
  
        this.karigar_id=r['id'];
        console.log(this.karigar_id);
        this.image_data2 =r['incoice_detail'];
        
        // for(let i=0; i<this.image_data2.length;i++){
        //   this.image_data3.push(this.image_data2[i].bill_name);
        // console.log(this.image_data);
  
        // }
        console.log(this.image_data2);
        
      });
    
  
  }

}
