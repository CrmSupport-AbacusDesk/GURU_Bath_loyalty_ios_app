import { Component, ViewChild } from '@angular/core';
import { Platform, Nav,Events, App, ToastController, AlertController, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { TabsPage } from '../pages/tabs/tabs';
import * as jwt_decode from "jwt-decode";
import { DbserviceProvider } from '../providers/dbservice/dbservice';
// import { AboutusModalPage } from '../pages/aboutus-modal/aboutus-modal';

import { Push, PushObject, PushOptions} from '@ionic-native/push';
import { AppVersion } from '@ionic-native/app-version';
import { SelectRegistrationTypePage } from '../pages/select-registration-type/select-registration-type';
import { DashboardPage } from '../pages/dashboard/dashboard';

import { Network } from '@ionic-native/network';
import { DealerHomePage } from '../pages/dealer-home/dealer-home';
import { DealerProfilePage } from '../pages/dealer-profile/dealer-profile';
import { AboutPage } from '../pages/about/about';
import { VideoCategoryPage } from '../pages/video-category/video-category';
import { CheckinListPage } from '../pages/sales-app/checkin-list/checkin-list';
import { AttendencePage } from '../pages/attendence/attendence';
import { MainDistributorListPage } from '../pages/sales-app/main-distributor-list/main-distributor-list';
import { DistributorListPage } from '../pages/sales-app/distributor-list/distributor-list';
import { TravelListPage } from '../pages/travel-list/travel-list';
import { LeadsDetailPage } from '../pages/leads-detail/leads-detail';
import { LeaveListPage } from '../pages/leave-list/leave-list';
import { FavoriteProductPage } from '../pages/favorite-product/favorite-product';
import { NewarrivalsPage } from '../pages/newarrivals/newarrivals';
import { CategoryPage } from '../pages/category/category';
import { DealerDealerListPage } from '../pages/dealer-dealer-list/dealer-dealer-list';
import { DealerCheckInPage } from '../pages/dealer-check-in/dealer-check-in';
import { DealerOrderPage } from '../pages/dealer-order/dealer-order';
import { DealerAddorderPage } from '../pages/dealer-addorder/dealer-addorder';
import { DealerDiscountPage } from '../pages/dealer-discount/dealer-discount';
import { ContactPage } from '../pages/contact/contact';
// import { OfflineDbProvider } from '../providers/offline-db/offline-db';
import { LanguagePage } from '../pages/language/language';
import { TranslateService } from '@ngx-translate/core';
import { Market } from '@ionic-native/market';


export interface PageInterface {
  
  title: string;
  name: string;
  component: any;
  
  icon: string;
  index?: number;
  tabName?: string;
  tabComponent?: any;
  show:any;
  
  
}
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  
  @ViewChild(Nav) nav: Nav;
  tokenInfo:any='';
  rootPage:any;
  lang:any='en';
  pages: PageInterface[];
  notifications:any;
  user_type:any;
  idlogin:any;
  registration:any;
  playStoreAppVersion:any='';
  mobileAppVersion:any='';
  karigar_id:any='';
  mobile_version:any='';
  iosStoreAppVersion:any='';

  
  public UserLoggedInData: any = {};
  
  constructor( private network :Network,
    public market: Market,
    public platform: Platform,
    statusBar: StatusBar,
    public menu: MenuController,
    public splashScreen: SplashScreen,
    public modalCtrl: ModalController,
    public storage:Storage,
    public events:Events,
    private app: App,
    public toastCtrl:ToastController,
    public alertCtrl:AlertController,
    public push: Push,
    public dbService:DbserviceProvider,
    //  public offlineDB:OfflineDbProvider,
    public translate:TranslateService,
    public appVersion: AppVersion,
    public service:DbserviceProvider)  {
      
      platform.ready().then(() => {
        
        statusBar.overlaysWebView(false);
        splashScreen.hide();
        statusBar.backgroundColorByHexString('#000000');
        // this.device_version();
        this.onCheckAppCurrentVersionHandler();
        storage.get('offlineDBLastInfo').then((offlineDBLastInfo) => {
          
          console.log(offlineDBLastInfo);
          if(!offlineDBLastInfo || !offlineDBLastInfo.isSetUpCompleted) {
            
            offlineDBLastInfo = {};
            offlineDBLastInfo.isSetUpCompleted = 0;
            offlineDBLastInfo.lastUpdatedTime = '';
            storage.set('offlineDBLastInfo', {});
          }
          
          //  this.offlineDB.offlineDBLastInfo = offlineDBLastInfo;
        });
        
        storage.get('userStorageData').then((storageData) => {
          
          this.dbService.userStorageData = storageData;
          
          const tokenData = storageData && storageData.token ? storageData.token : '';
          console.log(tokenData);
          
          if(tokenData && tokenData != null) {
            
            const loginType = storageData.loginType;
            console.log(loginType);
            
            if (loginType == 'CMS') {
              
              const karigarId = storageData.id;
              this.onGetLoggedInUserDataHandler(karigarId);
              
            } else if(loginType == 'Employee' || loginType == 'SFA') {
              
              this.nav.setRoot(DashboardPage);
              this.onSetSalesUserSideBarPage();
              
            } else if (loginType == 'DrLogin') {
              
              this.nav.setRoot(DealerHomePage);
              this.onSetDrSideBarPage('LoggedIn');
            }
            
          } else {
            
            // this.rootPage = SelectRegistrationTypePage;
            this.rootPage = LanguagePage;
            
          }
        });
        
        
        platform.registerBackButtonAction(() => {
          
          const overlayView = this.app._appRoot._overlayPortal._views[0];
          
          if (overlayView && overlayView.dismiss) {
            
            overlayView.dismiss();
            return;
          }
          
          const nav = app.getActiveNav();
          const activeView = nav.getActive().name;
          
          console.log(activeView);
          console.log(nav.canGoBack());
          
          if ( activeView == 'HomePage' || activeView == 'MobileLoginPage'
          || activeView == 'OtpPage' ||  activeView == 'DealerHomePage'
          ||  activeView == 'DashboardPage' ||  activeView == 'SelectRegistrationTypePage') {
            
            console.log('shouldStartSetUpProcess');
            // console.log(this.offlineDB.shouldStartSetUpProcess);
            
            // if(this.offlineDB.shouldStartSetUpProcess === false ) {
            
            //     if (this.dbService.backButton == 0) {
            
            //             this.dbService.backButton = 1;
            
            //             let toast = this.toastCtrl.create({
            
            //                   message: 'Press again to exit!',
            //                   duration: 2000
            //             });
            
            //             toast.present();
            
            //             setTimeout(() => {
            
            //                 this.dbService.backButton = 0;
            
            //             }, 2500);
            
            //       } else {
            //           this.platform.exitApp();
            //       }
            
            //  } 
            //      else {
            
            //       this.dbService.onShowMessageAlertHandler('Offline SetUp InProcess, Please Wait...');
            // }
            
          } else if (activeView == 'DealerAddorderPage') {
            
            
          } else if (nav.canGoBack()) {
            
            console.log('ok');
            nav.pop();
            
          } else if(activeView == 'GiftListPage' || activeView == 'TransactionPage'
          || activeView == 'ProfilePage' || activeView =='MainHomePage') {
            
            nav.parent.select(0);
          }
          else if (nav.canGoBack() == false) 
          {
            console.log('ok');
            let alert = this.alertCtrl.create({
              title: 'App termination',
              message: 'Are you sure you want Exit?',
              buttons: [
                {
                  text: 'Stay',
                  handler: () => {
                    console.log('Cancel clicked');
                    // this.d.('Action Cancelled!')
                  }
                },
                {
                  text: 'Exit',
                  handler: () => {
                    this.platform.exitApp();
                  }
                }
              ]
            })
            
            alert.present();
            // nav.pop();
          } 
          
        });
      });
      
      
      
      this.events.subscribe('user:navigation_menu', () => {
        this.open_nav_menu();
      });
      
      this.events.subscribe('side_menu:navigation_barDealer', () => {
        // this.setPagesDealer('LoggedIn');
        this.open_nav_menu();
      });

      
    }
    
    
    onGetLoggedInUserDataHandler(karigarId) {
      
      this.dbService.onPostRequestDataFromApi({ karigar_id :karigarId },'app_karigar/profile', this.dbService.rootUrl).subscribe((result)=> {
        this.initPushNotification();
        console.log(result);
        
        if (result['status'] == "SUCCESS") {
          
          const karigarData = result['karigar'];
          this.karigar_id = result['karigar']
          // this.device_version();
          
          // this.onCheckAppCurrentVersionHandler();
          console.log("k id===>",karigarData)
          
          if (karigarData.del == '1') {
            
            this.rootPage = SelectRegistrationTypePage;
            this.dbService.onShowMessageAlertHandler('Your Account has been suspended');
            
            this.storage.set('userStorageData', {});
            this.dbService.userStorageData = {};
            return;
            
          } else if(karigarData.status == 'Verified') {
            
            this.rootPage = TabsPage;
            
          } else  if( karigarData.status != 'Verified') {
            
            this.rootPage = TabsPage;
          }
          
        } else {
          
          this.storage.set('userStorageData', {});
          this.dbService.userStorageData = {};
          return;
        }
        
      }, error => {
        
        this.rootPage = TabsPage;
      });
    }
    device_version(){
      this.appVersion.getVersionNumber().then(resp => {              
          console.log(resp);
          this.mobileAppVersion = resp;
          this.senDiviceVersion();
          console.log("version ===>",this.mobile_version,)            
          console.log("version");
          
      });
  }
    senDiviceVersion(){
      this.dbService.onPostRequestDataFromApi({'divice_Version':this.mobileAppVersion,'karigar_id':this.dbService.userStorageData.id},'app_karigar/update_karigar_version', this.dbService.rootUrl)
      .subscribe((result:any)=> {        
          
          this.getData();
      });

    }
    getData()
    {   
            console.log("Check");
            this.dbService.onPostRequestDataFromApi({'karigar_id':this.dbService.userStorageData.id},'app_karigar/karigarHome', this.dbService.rootUrl)
            .subscribe((r:any)=>
            {
                console.log(r);
                this.mobile_version =  r['karigar'].version
                 
              
            },() => {
               
            });
    }
    
    onSetSalesUserSideBarPage() {
      
      
      console.log('hello111');
      
      if ( this.dbService.userStorageData.role_id
        && (this.dbService.userStorageData.role_id == 'Market'
        || this.dbService.userStorageData.user_type == 'MARKET'
        || this.dbService.userStorageData.user_type == 'market')
        && this.dbService.userStorageData.token != undefined
        )  {
          
          console.log('hello2222');
          
          this.pages = [
            {
              title : 'Home', name: 'HomePage', component:DashboardPage, index: 0, icon: 'home', show: true
            },
            {
              title: 'Products', name: 'CategoryPage', component: CategoryPage , index: 9,icon: 'shopping_basket', show: true
            },
            {
              title: 'New Arrivals', name: 'NewarrivalsPage', component: NewarrivalsPage,index: 11, icon: 'fiber_new', show: true
            },
            {
              title : 'Favorite Product', name: 'Favorite Product', component:FavoriteProductPage, index: 2, icon: 'star', show: true
            },
            {
              title : 'Videos', name: 'Videos', component:VideoCategoryPage, index: 9, icon: 'videocam', show: true
            },
            {
              title: 'Check-In', name: 'Check-In', component: CheckinListPage , index: 9,icon: 'home_work', show: true
            },
            {
              title: 'Attendance', name: 'AttendencePage', component: AttendencePage,index: 11, icon: 'date_range', show: true
            },
            {
              title : 'Channel Partner', name: 'Distributor', component: MainDistributorListPage,index: 15, icon: 'group', show: true
            },
            {
              title : 'Direct Dealer', name: 'Direct Dealer', component: MainDistributorListPage,index: 13, icon: 'person_pin', show: true
            },
            {
              title : 'Dealer', name: 'Dealer', component: MainDistributorListPage,index: 12, icon: 'person', show: true
            },
            {
              title: 'Lead', name: 'Lead', component: DistributorListPage,index: 5, icon: 'group_add', show: true
            },
            {
              title : 'Travel Plan', name: 'TravelListPage', component: TravelListPage, index: 23, icon: 'contacts', show: true
            },
            {
              title : 'Leave', name: 'LeaveListPage', component:LeaveListPage ,index: 10, icon: 'beach_access', show: true
            },
          ];
          
          console.log(this.pages);
        }
        
        if (this.dbService.userStorageData.role_id && this.dbService.userStorageData.user_type == 'OFFICE') {
          
          // this means user is distributor executive
          
          console.log('hello3333');
          
          
          this.pages = [
            {
              title : 'Home', name: 'HomePage', component:DashboardPage, index: 0, icon: 'home', show: true
            },
            {
              title: 'Products', name: 'CategoryPage', component: CategoryPage , index: 9,icon: 'shopping_basket', show: true
            },
            {
              title: 'New Arrivals', name: 'NewarrivalsPage', component: NewarrivalsPage,index: 11, icon: 'fiber_new', show: true
            },
            {
              title : 'Favorite Product', name: 'Favorite Product', component:FavoriteProductPage, index: 2, icon: 'star', show: true
            },
            {
              title : 'Videos', name: 'Videos', component:VideoCategoryPage, index: 9, icon: 'videocam', show: true
            },
            {
              title: 'Check-In', name: 'Check-In', component: CheckinListPage , index: 9,icon: 'home_work', show: true
            },
            {
              title: 'Attendance', name: 'AttendencePage', component: AttendencePage,index: 11, icon: 'date_range', show: true
            },
            {
              title : 'Dealer', name: 'Dealer', component: MainDistributorListPage,index: 12, icon: 'person', show: true
            },
            {
              title: 'Lead', name: 'Lead', component: DistributorListPage,index: 5, icon: 'group_add', show: true
            },
            {
              title : 'Travel Plan', name: 'TravelListPage', component: TravelListPage, index: 23, icon: 'contacts', show: true
            },
            {
              title : 'My Channel Partner', name: 'My Channel Partner', component: LeadsDetailPage, index: 24, icon: 'group', show: true
            },
            {
              title : 'Leave', name: 'LeaveListPage', component:LeaveListPage ,index: 10, icon: 'beach_access', show: true
            },
          ];
        }
        
        
        console.log('hello4444');
        
      }
      
      
      onSetDrSideBarPage(loginType) {
        
        if (loginType == 'LoggedIn') {
          
          if(this.dbService.userStorageData.type == '1') {
            
            var name = 'Dealer List';
            var title = 'Dealer List';
            var show = true;
            
          } else if(this.dbService.userStorageData.type == '3') {
            
            var name = 'Distributor List';
            var title = 'Distributor List';
            var show = true;
            
          } else {
            
            var show = false;
          }
          
          if (this.dbService.userStorageData.type == 1) {
            
            this.pages = [
              
              {
                title : 'Home', name: 'HomePage', component:DealerHomePage, index: 0, icon: 'home', show: true
              },
              {
                title : 'Product Catalogue', name: 'Product Catalogue', component:CategoryPage, index: 2, icon: 'toys', show: true
              },
              {
                title : 'New Arrivals', name: 'New Arrivals', component:NewarrivalsPage, index: 1, icon: 'fiber_new', show: true
              },
              {
                title : 'Favorite Product', name: 'Favorite Product', component:FavoriteProductPage, index: 2, icon: 'star', show: true
              },
              {
                title : 'Videos', name: 'Videos', component:VideoCategoryPage, index: 9, icon: 'videocam', show: true
              },
              {
                title : 'My Dealers', name: name, component:DealerDealerListPage, index: 7, icon: 'how_to_reg', show: show
              },
              {
                title : 'Sales Person Visit', name: 'DealerCheckInPage', component:DealerCheckInPage, index: 4, icon: 'home_work', show: true
              },
              {
                title : 'My Orders', name: 'DealerOrderPage', component:DealerOrderPage, index: 3, icon: 'all_inbox', show: true
              },
              {
                title : 'Add New Order', name: 'DealerAddorderPage', component:DealerAddorderPage, index: 8, icon: 'widgets', show: true
              },
              {
                title : 'Discount', name: 'DealerDiscountPage', component:DealerDiscountPage, index: 5, icon: 'card_giftcard', show: true
              },
              {
                title : 'About Us', name: 'About Us', component:AboutPage, index: 6, icon: 'contacts', show: true
              },
              {
                title : 'Contact Us', name: 'Contact Us', component:ContactPage, index: 7, icon: 'contact_phone', show: true
              },
            ];
            
          } else  {
            
            // that means login user is dealer
            
            this.pages=[
              {
                title : 'Home', name: 'HomePage', component:DealerHomePage, index: 0, icon: 'home', show: true
              },
              {
                title : 'Product Catalogue', name: 'Product Catalogue', component:CategoryPage, index: 2, icon: 'toys', show: true
              },
              {
                title : 'New Arrivals', name: 'New Arrivals', component:NewarrivalsPage, index: 1, icon: 'fiber_new', show: true
              },
              {
                title : 'Favorite Product', name: 'Favorite Product', component:FavoriteProductPage, index: 2, icon: 'star', show: true
              },
              {
                title : 'Videos', name: 'Videos', component:VideoCategoryPage, index: 9, icon: 'videocam', show: true
              },
              {
                title : 'My Distributors', name: name, component:DealerDealerListPage, index: 7, icon: 'how_to_reg', show: show
              },
              {
                title : 'My Orders', name: 'DealerOrderPage', component:DealerOrderPage, index: 3, icon: 'all_inbox', show: true
              },
              {
                title : 'Add New Order', name: 'DealerAddorderPage', component:DealerAddorderPage, index: 8, icon: 'widgets', show: true
              },
              {
                title : 'About Us', name: 'About Us', component:AboutPage, index: 6, icon: 'contacts', show: true
              },
              {
                title : 'Contact Us', name: 'Contact Us', component:ContactPage, index: 7, icon: 'contact_phone', show: true
              },
            ];
          }
        }
      }
      
      
      onGoToSalesUserPageHandler(page: PageInterface) {
        
        let params = {};
        
        if (page.index) {
          params = { tabIndex: page.index };
        }
        
        if(page.name == 'Direct Dealer' ) {
          
          this.nav.push(page.component, { type:7 });
          
        } else if (page.name == 'Dealer') {
          
          this.nav.push(page.component, { type:3 });
          
        } else if (page.name == 'Distributor') {
          
          this.nav.push(page.component, { type:1 });
          
        } else if(page.name=='My Channel Partner') {
          
          this.dbService.onPostRequestDataFromApi({},'DealerData/getCreatedDr', this.dbService.rootUrlSfa).subscribe((resp)=> {
            
            console.log(resp);
            this.nav.push(page.component, {'dr_id':resp[0],'type':'Dr','showRelatedTab': 'false'});
          })
          
        } else if (this.nav.getActiveChildNavs().length && page.index != undefined)  {
          
          console.log(page.index);
          this.nav.getActiveChildNavs()[0].select(page.index);
          
        } else {
          
          console.log(page.index);
          console.log(page.component );
          this.nav.push(page.component, params);
        }
      }
      
      
      onGoToDrPageHandler(page: PageInterface) {
        
        let params = {};
        
        if (page.name == 'DealerOrderPage') {
          
          console.log(this.dbService.userStorageData.type);
          
          params = {
            
            type: 'Primary',
            tabIndex: page.index
          };
          
        } else {
          
          if (page.index) {
            
            params = { tabIndex: page.index };
          }
        }
        
        
        if (this.nav.getActiveChildNavs().length && page.index != undefined) {
          
          console.log(page.index);
          this.nav.getActiveChildNavs()[0].select(page.index);
          
        } else {
          
          console.log(page.index);
          console.log(page.component );
          
          if(page.name == 'HomePage') {
            
            this.nav.setRoot(DealerHomePage);
            
          } else {
            
            this.nav.push(page.component, params);
          }
        }
      }
      
      
      onGoToProfilePage() {
        
        this.nav.push(DealerProfilePage);
      }
      
      
      onCheckAppCurrentVersionHandler()  {
        this.dbService.onPostRequestDataFromApi('', 'app_karigar/app_version', this.dbService.rootUrl).subscribe(resp => {
            this.iosStoreAppVersion = resp['ios'];
            this.appVersion.getVersionNumber().then(resp => {
                this.mobileAppVersion = resp;
                if (this.mobileAppVersion != this.iosStoreAppVersion) {
                      let updateAlert = this.alertCtrl.create({
                          title: 'Update Available',
                          message: 'A newer version of this app is available for download. Please update it from App Store !',
                          buttons: [
                              {
                                text: 'Cancel',
                              },
                              {
                                  text: 'Update Now',
                                  handler: () => {
                                    this.market.open("id6444117885");
                                  }

                              }
                          ]
                      });
                      updateAlert.present();
                }
            });
        });
    }

     


      
      
      onLogoutHandler() {
        
        const alert = this.alertCtrl.create({
          title: 'Logout!',
          message: 'Are you sure you want Logout?',
          buttons: [
            {
              text: 'No',
              handler: () => {
                console.log('Cancel clicked');
              }
            },
            {
              text: 'Yes',
              handler: () => {
                
                this.storage.set('userStorageData', {});
                
                this.nav.setRoot(SelectRegistrationTypePage);
              }
            }
          ]
        })
        
        alert.present();
      }
      
      
      open_nav_menu() {
        
        console.log('test');
        this.menu.open('first');
        this.menu.enable(true, 'first');
        
        const loginType = this.dbService.userStorageData.loginType;
        
        if(loginType == 'Employee' || loginType == 'SFA') {
          
          console.log('Enter');
          
          this.onSetSalesUserSideBarPage();
          
        } else if (loginType == 'DrLogin') {
          
          this.onSetDrSideBarPage('LoggedIn');
        }
      }
      
      
      
      get_user_lang()
      {
        this.storage.get("token")
        .then(resp=>{
          this.tokenInfo = this.getDecodedAccessToken(resp );
          
          this.service.post_rqst({"login_id":this.tokenInfo.sub},"app_karigar/get_user_lang")
          .subscribe(resp=>{
            console.log(resp);
            this.lang = resp['language'];
            this.translate.use(this.lang);                                          
            
            // commented
            
          })
        })
      }
      getDecodedAccessToken(token: string): any
      {
        try{
          return jwt_decode(token);
        }
        catch(Error){
          return null;
        }
      }
      
      
      
      initPushNotification()
      {
        
        console.log('call funcation initPushNotification');
        
        
        this.push.hasPermission().then((res: any) => {
          if (res.isEnabled)
          {
            console.log('We have permission to send push notifications');
          }
          else
          {
            console.log('We don\'t have permission to send push notifications');
          }
        });
        
        const options: PushOptions = {
          android: {
            senderID: '158421422619',
            icon: './assets/imgs/logo',
            forceShow:true
          },
          ios: {
            alert: 'true',
            badge: true,
            sound: 'false'
          },
          windows: {}
        };
        
        const pushObject: PushObject = this.push.init(options);
        
        pushObject.on('notification').subscribe((notification: any) => {
          console.log('Received a notification', notification)
          console.log("error1",notification.additionalData.type );
          console.log("error1",notification.additionalData );
          this.notifications = notification.additionalData.type;
          // this.nav.push(NotificationPage);
          // if(notification.additionalData.type == "message"){
          
          // }
        });
        
        
        pushObject.on('registration')
        .subscribe((registration) =>{
          console.log('Device registered', registration);
          console.log('Device Token', registration.registrationId);
          
          this.storage.set('fcmId', registration);
          console.log( this.tokenInfo);
          console.log(this.storage);
          this.storage.get('user_type').then((user_type) => {
            // this.user_type = user_type;
            // console.log(this.user_type);
            console.log(user_type);
          });
          this.storage.get('userId').then((userId) => {
            this.idlogin = userId;
            console.log(this.idlogin);
            console.log(userId);
          });
          this.registration=registration.registrationId;
          this.registrationid(registration.registrationId);
        });
        
        pushObject.on('error')
        .subscribe((error) =>
        console.error('Error with Push plugin', error));
      }
      registrationid(registrationId){
        console.log(" enter registration");
        console.log(registrationId);
        
        this.storage.get('user_type').then((user_type) => {
          this.user_type = user_type;
          console.log(this.user_type);
          console.log('registrationUserType',user_type);
          
        });
        this.storage.get('userId').then((userId) => {
          this.idlogin = userId;
          console.log(this.idlogin,  this.idlogin);
          console.log("userId");
          console.log('registrationId line number 830',userId);
        });
        
        setTimeout(() =>{
          this.service.post_rqst({'registration_id':registrationId,'karigar_id':this.idlogin},'app_karigar/add_registration_id')
          .subscribe((r)=>
          {
            console.log("success 812", r);
            console.log(r);
            
          });
        }, 5000);
        
        
      }
      
    }
    