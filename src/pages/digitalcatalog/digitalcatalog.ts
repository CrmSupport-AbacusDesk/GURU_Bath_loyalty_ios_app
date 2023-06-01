import { DbserviceProvider } from './../../providers/dbservice/dbservice';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

/**
* Generated class for the DigitalcatalogPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-digitalcatalog',
  templateUrl: 'digitalcatalog.html',
})
export class DigitalcatalogPage {
  pdf:any=[];
  uploadUrl:string='';
  tokenInfo: any;
  db: any;
  filter:any={};
  
  constructor(public navCtrl: NavController, private iab: InAppBrowser, public navParams: NavParams, public dbService:DbserviceProvider) {
    this.uploadUrl = dbService.upload_url3 ;
    this.getpdflist();
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad DigitalcatalogPage');
  }

  
  getpdflist()
  {
    this.filter.limit=0;
    this.dbService.post_rqst({"login_id":this.dbService.karigar_id, 'filter' : this.filter, },"app_karigar/product_catalogue_list")
    .subscribe( r =>
      {
        console.log(r);
        this.pdf = r['pdf']
      }); 
    }

    flag:any='';
    loadData(infiniteScroll)
    {
        this.filter.limit=this.pdf.length;
        this.dbService.post_rqst({'filter' : this.filter,'karigar_id':this.dbService.karigar_id},'app_karigar/product_catalogue_list')
        .subscribe( (r) =>
        {
            console.log(r);
            if(r=='')
            {
                this.flag=1;
            }
            else
            {
                setTimeout(()=>{
                    this.pdf=this.pdf.concat(r['pdf']);
                    infiniteScroll.complete();
                },1000);
            }
        });
    }



  openPdf(url) {
    this.iab.create(url, '_system')
  }
  }
  