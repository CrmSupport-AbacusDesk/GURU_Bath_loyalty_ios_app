import { ViewProfilePage } from './../view-profile/view-profile';
import { LeadsDetailPage } from './../leads-detail/leads-detail';
import { DbserviceProvider } from './../../providers/dbservice/dbservice';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading, AlertController, ActionSheetController, ModalController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';

/**
 * Generated class for the UploadInvoicePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-upload-invoice',
  templateUrl: 'upload-invoice.html',
})
export class UploadInvoicePage {

  videoId: any;
  loading:Loading;
  data:any={};
  karigar_id:any='';
  selectedFile:any=[];
  image_data:any=[];
  image_data2:any=[];
  filter :any = {};
  incoice_detail:any=[];



  url:any=''


             
 constructor(public navCtrl: NavController,public modalCtrl:ModalController, public loadingCtrl:LoadingController,private camera: Camera,public service:DbserviceProvider,public actionSheetController: ActionSheetController, public dbService:DbserviceProvider, public alertCtrl:AlertController, public navParams: NavParams, )
  {
    this.url = service.upload_url3;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UploadInvoicePage');
    this.showImage();
  }


  flag:boolean=true;

  onUploadChange(evt: any) {
    // this.flag=false;
    // const file = evt.target.files[0];

    // if (file) {
    //   const reader = new FileReader();

    //   reader.onload = this.handleReaderLoaded.bind(this);
    //   reader.readAsBinaryString(file);
    // }
    let actionsheet = this.actionSheetController.create({
      title:" Upload File",
      cssClass: 'cs-actionsheet',

      buttons:[{
        cssClass: 'sheet-m',
        text: 'Camera',
        icon:'camera',
        handler: () => {
          console.log("Camera Clicked");
          this.takeDocPhoto();
        }
      },
      {
        cssClass: 'sheet-m1',
        text: 'Gallery',
        icon:'image',
        handler: () => {
          console.log("Gallery Clicked");
          this.getDocImage();
        }
      },
      {
        cssClass: 'cs-cancel',
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }
    ]
  });
  actionsheet.present();
}

viewInvoice(name)
    {
      console.log(name);
      
      this.modalCtrl.create(ViewProfilePage, {"Image": name, 'type':'normal_img'}).present();
    }

takeDocPhoto()
{
  console.log("i am in camera function");
  const options: CameraOptions = {
    quality: 70,
    destinationType: this.camera.DestinationType.DATA_URL,
    targetWidth : 500,
    targetHeight : 400
  }

  console.log(options);
  this.camera.getPicture(options).then((imageData) => {
    this.flag=false;
    this.data.document_image = 'data:image/jpeg;base64,' + imageData;
    this.image_data.push({'image_name':this.data.document_image})
    console.log(this.image_data);
    
    console.log(this.data.document_image);
  }, (err) => {
  });
}

getDocImage()
{
  const options: CameraOptions = {
    quality: 70,
    destinationType: this.camera.DestinationType.DATA_URL,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    saveToPhotoAlbum:false
  }
  console.log(options);
  this.camera.getPicture(options).then((imageData) => {
    this.flag=false;
    this.data.document_image = 'data:image/jpeg;base64,' + imageData;
    this.image_data.push({'image_name':this.data.document_image})
    console.log('line number 122',this.image_data);
  }, (err) => {
  });
}
image_data3:any=[];
showImage(){

  this.filter.limit = 0;

  this.dbService.onPostRequestDataFromApi( {'filter' : this.filter,'karigar_id': this.dbService.userStorageData.id },'app_karigar/customer_invoice_listing', this.dbService.rootUrl).subscribe( r =>
    {
      console.log(r);

      this.karigar_id=r['id'];
      console.log(this.karigar_id);
      this.image_data2 = r['incoice_detail'];
      // for(let i=0; i<this.image_data2.length;i++){
      //   this.image_data3.push(this.image_data2[i].bill_name);
      // console.log(this.image_data);

      // }
      console.log(this.image_data2);
      
    });
  

}


remove_image(image_id)
  {

    this.dbService.onPostRequestDataFromApi( {'id': image_id },'app_karigar/delete_customer_invoice', this.dbService.rootUrl).subscribe( r =>
      {

        if(r.status == 'SUCESS'){
          this.showImage();
        }
      });
      

    
  }


  delete(i){
    this.image_data.splice(i,1);
  }

submit()
{
  console.log(this.selectedFile);
  this.presentLoading();
console.log('line number=192' ,this.image_data);

  

  this.dbService.onPostRequestDataFromApi( {'bill_name':this.image_data,'karigar_id': this.dbService.userStorageData.id },'app_karigar/add_customer_invoice', this.dbService.rootUrl).subscribe( r =>
    {
      console.log(r);
      this.loading.dismiss();
       this.showImage();
      this.image_data=[];
      this.karigar_id=r['id'];
      console.log(this.karigar_id); 
    });
  }  
    
  presentLoading()
  {
    this.loading = this.loadingCtrl.create({
      content: "Please wait...",
      dismissOnPageChange: true
    });
    this.loading.present();
  }


}
