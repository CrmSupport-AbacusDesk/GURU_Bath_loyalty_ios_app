import { Component,ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Loading, LoadingController, ModalController,ToastController } from 'ionic-angular';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { TaskClosePage } from '../../task-close/task-close';
import { ViewProfilePage } from '../../view-profile/view-profile';
import { DomSanitizer } from '@angular/platform-browser';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { ComplaintRemarksPage } from '../../complaint-remarks/complaint-remarks';
import { PlumberCheckinPage } from '../../plumber-checkin/plumber-checkin';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder';


/**
* Generated class for the ComplaintDetailPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/
declare var google;

@IonicPage()
@Component({
  selector: 'page-pulmber-customer-detail',
  templateUrl: 'pulmber-customer-detail.html',
})
export class PulmberCustomerDetailPage {
  @ViewChild('map') mapElement: ElementRef;
  complaint_id:any='';
  plumber_detail:any={};
  complaint_media:any=[];
  loading: Loading;
  new_long: any;
  new_lat: any;
  close_com:any;
  remark_count:any;
  karigar_detail:any;
  last_point:any;
  today_point:any;
  mode=1;
  geoAddress:any='';
  map: any;
  checkin_time:any = true;
  url:string='';


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public dbService:DbserviceProvider,
    public loadingCtrl:LoadingController ,
    public modalCtrl: ModalController,
    public sanitizer: DomSanitizer ,
    public geolocation: Geolocation,
    private launchNavigator: LaunchNavigator,
    public locationAccuracy: LocationAccuracy,
    private nativeGeocoder: NativeGeocoder,
    public toastCtrl:ToastController,
    public alertCtrl:AlertController,
    ) {
      this.close_com = this.navParams.get('close_com');
      this.url = dbService.upload_url3  
          
      
    }
    
    photoURL(url) {
      return this.sanitizer.bypassSecurityTrustUrl(url);
    }

    
    
    ionViewDidLoad() {
      console.log('ionViewDidLoad PulmberCustomerDetailPage');
      this.presentLoading();
    
      this.complaint_id = this.navParams.get('id');
      this.getPlumberDetail(this.complaint_id);
      // this.getData();
    }

    geoencoderOptions: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };
    
    presentLoading()
    {
      this.loading = this.loadingCtrl.create({
        content: "Please wait...",
        dismissOnPageChange: true
      });
      this.loading.present();
    }


   


    addInfoWindow(marker, content){
    
      let infoWindow = new google.maps.InfoWindow({
        content: content
      });
      
      google.maps.event.addListener(marker, 'click', () => {
        infoWindow.open(this.map, marker);
      });
    }


    getGeoencoder(latitude,longitude)
  {
    this.nativeGeocoder.reverseGeocode(latitude, longitude, this.geoencoderOptions)
    .then((result: NativeGeocoderReverseResult[]) => {
      this.geoAddress = this.generateAddress(result[0]);
    })
    .catch((error: any) => {
      // alert('Error getting location'+ JSON.stringify(error));
    });
  }
    

  generateAddress(addressObj){
    let obj = [];
    let address = "";
    for (let key in addressObj) {
      obj.push(addressObj[key]);
    }
    obj.reverse();
    for (let val in obj) {
      if(obj[val].length)
      address += obj[val]+', ';
    }
    // console.log(address);
    
    return address.slice(0, -2);
  }


    getPlumberDetail(id)
    {
      
      this.dbService.onPostRequestDataFromApi( {'complaints_id':id},'app_karigar/getComplaintbyId', this.dbService.rootUrl).subscribe(response =>
        {
          console.log(response);
          this.loading.dismiss();
          this.plumber_detail = response['complaintDetails'];
          this.complaint_media = response['complaintDetails']['image'] ;
          this.remark_count =response.complaintHistoryCount;
          // console.log(this.complaint_list);
          
          // this.showSuccess("Profile Photo Updated")
          if(this.complaint_media[0].type == "video"){
            for (let i = 0; i < this.complaint_media.length; i++) {
              this.complaint_media[i].file_name =  this.sanitizer.bypassSecurityTrustResourceUrl( this.dbService.upload_url+'app/uploads/'+this.complaint_media[i].file_name);
            }
          }else{
            for (let i = 0; i < this.complaint_media.length; i++) {
              this.complaint_media[i].file_name =  this.sanitizer.bypassSecurityTrustResourceUrl( this.complaint_media[i].file_name);
              
            }
          }
        });
        
      }
      
      viewComplaintImage(i)
      {
        this.modalCtrl.create(ViewProfilePage, {"Image": this.complaint_media[i].file_name}).present();
      }
      
      goToTaskPage(lable)
      {
        this.navCtrl.push( TaskClosePage,{'id':this.plumber_detail.complaintId,'mobile':this.plumber_detail.customerMobileNo,'name':this.plumber_detail.customerName,'lable':lable});
      }
      
      getDirection()
      {
        // this.navCtrl.push(PointLocationPage,{'lat':this.plumber_detail.cust_lat,'log':this.plumber_detail.cust_long,'old_loc':this.plumber_detail.cust_geo_address});
        
        this.geolocation.getCurrentPosition().then((resp) => {
          // let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
          
          this.new_lat=resp.coords.latitude;
          this.new_long=resp.coords.longitude;
          var latLong= this.new_lat+','+this.new_long;
          
          let options: LaunchNavigatorOptions = {
            start: latLong,
            // app: LaunchNavigator.APPS.UBER
          };
          
          this.launchNavigator.navigate(this.plumber_detail.cust_lat+','+this.plumber_detail.cust_long, options)
          .then(
            success => console.log('Launched navigator'),
            error => console.log('Error launching navigator', error)
            );
          });
          
        }
        
        goToRemarkHistory()
        {
          this.navCtrl.push(ComplaintRemarksPage,{'id':this.plumber_detail.complaintId})
        }

      loadMap() {
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
        .then(() => {
          // let options = {
          //   maximumAge: 10000, timeout: 15000, enableHighAccuracy: true
          // };
          this.geolocation.getCurrentPosition().then((resp) => {
            let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
            let mapOptions = {
              center: latLng,
              zoom: 15,
              mapTypeId: google.maps.MapTypeId.ROADMAP
            }
            
            
            this.new_lat=resp.coords.latitude;
            this.new_long=resp.coords.longitude;
            
            console.log(latLng);
            console.log('inside lat long=====>',    this.new_lat)
            console.log('inside lat long======>',    this.new_long)
            this.checkinPass(); 
            this.getGeoencoder(resp.coords.latitude, resp.coords.longitude);
            this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
            this.addMarker(this.map);
            
          })
          .catch((error) => {
            // this.dbService.presentToast('Error getting location')
            
          })
        },
        error => {
          console.log('Error requesting location permissions', error);
          let toast = this.toastCtrl.create({
            message: 'Allow Location Permissions',
            duration: 3000,
            position: 'bottom'
          });
          toast.present();
        });
         
         
      }

      checkin(){
        this.loadMap(); 
        // if(this.plumber_detail.plumberStatus == "Pending"){
         
        //   this.showAlert("You Are Not verified");
        // }
        // else{
        //     
        // }
        }

         showAlert(text)
         {
             let alert = this.alertCtrl.create({
                 title:'Alert!',
                 cssClass:'action-close',
                 subTitle: text,
                 buttons: ['OK']
             });
             alert.present();
         }

      checkinPass(){
        console.log('====================================');
        console.log("complian id ===>",this.plumber_detail.complaintId);
        console.log('====================================');
        console.log(this.geoAddress);
        console.log("outside this.new_lat=====>",this.new_lat);
        console.log("outside this.new_lat=====>",this.new_long);
        this.checkin_time = false;
        this.dbService.onPostRequestDataFromApi( {'plumber_id': this.dbService.userStorageData.id, 'complaint_id':this.plumber_detail.complaintId, 'cust_lat': this.new_lat,'cust_long':this.new_long},'app_karigar/plumberCheckIn', this.dbService.rootUrl).subscribe(result =>
          {
            console.log(result);
            if(result['msg']=='CheckinSuccess')
            {
             //  this.showSuccess("Geo Location updated Successfully!")   ;
             console.log('locations updated');
             
            }
            else{
              
              alert('Geo Location not found! Try Again');
              return;
            }
            
            // alert('Geo Location not found! Try Again');
            // return;
            
            // this.navCtrl.setRoot(TabsPage,{index:'5'});
            //   this.navCtrl.setRoot(ProfilePage);
            
          });
       }
       
  
      addMarker(map:any){
      
        let marker = new google.maps.Marker({
          map: map,
          animation: google.maps.Animation.DROP,
          position: map.getCenter()
        });
        
        let content = this.geoAddress;
        
        this.addInfoWindow(marker, content);
        
      }
      
    }
      