/****************************************************************************
 Copyright (c) 2013 cocos2d-x.org
 
 http://www.cocos2d-x.org
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

#import "AdsAdmob.h"
#import "AdsWrapper.h"

#define OUTPUT_LOG(...)     if (self.debug) NSLog(__VA_ARGS__);

@implementation AdsAdmob

@synthesize debug = __debug;
@synthesize strPublishID = __PublishID;
@synthesize testDeviceIDs = __TestDeviceIDs;

- (void) dealloc
{
    if (self.bannerView != nil) {
        [self.bannerView release];
        self.bannerView = nil;
    }

    if (self.testDeviceIDs != nil) {
        [self.testDeviceIDs release];
        self.testDeviceIDs = nil;
    }
    if (self.interstitial != nil) {
        self.interstitial.delegate = nil;
        [self.interstitial release];
        self.interstitial = nil;
    }
    [super dealloc];
}

#pragma mark InterfaceAds impl

- (void) configDeveloperInfo: (NSMutableDictionary*) devInfo
{
    self.strPublishID = (NSString*) [devInfo objectForKey:@"AdmobID"];
}

- (void) showAds: (NSMutableDictionary*) info position:(int) pos
{
    if (self.strPublishID == nil ||
        [self.strPublishID length] == 0) {
        OUTPUT_LOG(@"configDeveloperInfo() not correctly invoked in Admob!");
        return;
    }

    NSString* strType = [info objectForKey:@"AdmobType"];
    int type = [strType intValue];
    switch (type) {
    case kTypeBanner:
        {
            NSString* strSize = [info objectForKey:@"AdmobSizeEnum"];
            int sizeEnum = [strSize intValue];
            [self showBanner:sizeEnum atPos:pos];
            break;
        }
    case kTypeFullScreen:
            [self showInterstitial];
        break;
    default:
        OUTPUT_LOG(@"The value of 'AdmobType' is wrong (should be 1 or 2)");
        break;
    }
}

- (void) hideAds: (NSMutableDictionary*) info
{
    NSString* strType = [info objectForKey:@"AdmobType"];
    int type = [strType intValue];
    switch (type) {
    case kTypeBanner:
        {
            if (nil != self.bannerView) {
                [self.bannerView removeFromSuperview];
                [self.bannerView release];
                self.bannerView = nil;
            }
            break;
        }
    case kTypeFullScreen:
        OUTPUT_LOG(@"Now not support full screen view in Admob");
        break;
    default:
        OUTPUT_LOG(@"The value of 'AdmobType' is wrong (should be 1 or 2)");
        break;
    }
}

- (void) queryPoints
{
    OUTPUT_LOG(@"Admob not support query points!");
}

- (void) spendPoints: (int) points
{
    OUTPUT_LOG(@"Admob not support spend points!");
}

- (void) setDebugMode: (BOOL) isDebugMode
{
    self.debug = isDebugMode;
}

- (NSString*) getSDKVersion
{
    return @"6.4.2";
}

- (NSString*) getPluginVersion
{
    return @"0.2.0";
}

- (void) showBanner: (int) sizeEnum atPos:(int) pos
{
    GADAdSize size = kGADAdSizeBanner;
    switch (sizeEnum) {
        case kSizeBanner:
            size = kGADAdSizeBanner;
            break;
        case kSizeIABMRect:
            size = kGADAdSizeMediumRectangle;
            break;
        case kSizeIABBanner:
            size = kGADAdSizeFullBanner;
            break;
        case kSizeIABLeaderboard:
            size = kGADAdSizeLeaderboard;
            break;
        case kSizeSkyscraper:
            size = kGADAdSizeSkyscraper;
            break;
        default:
            break;
    }
    if (nil != self.bannerView) {
        [self.bannerView removeFromSuperview];
        [self.bannerView release];
        self.bannerView = nil;
    }
    
    self.bannerView = [[GADBannerView alloc] initWithAdSize:size];
    self.bannerView.adUnitID = self.strPublishID;
    self.bannerView.delegate = self;
    [self.bannerView setRootViewController:[AdsWrapper getCurrentRootViewController]];
    [AdsWrapper addAdView:self.bannerView atPos:pos];
    
    GADRequest* request = [GADRequest request];
    request.testDevices = [NSArray arrayWithArray:self.testDeviceIDs];
    [self.bannerView loadRequest:request];
}
//
//-(void)createAdmobAds
//{
//    self.interstitial = [[GADInterstitial alloc] init];
//    self.interstitial.adUnitID = @"ca-app-pub-5934662800023467/3099613280";
//    self.interstitial.delegate = self;
//    
//    [self.interstitial loadRequest:[GADRequest request]];
//}

- (void)preLoadInterstitial {
    //Call this method as soon as you can - loadRequest will run in the background and your interstitial will be ready when you need to show it
    GADRequest *request = [GADRequest request];
    self.interstitial = [[GADInterstitial alloc] init];
    self.interstitial.delegate = self;
    self.interstitial.adUnitID = @"ca-app-pub-5934662800023467/3099613280";
    request.testDevices = [NSArray arrayWithArray:self.testDeviceIDs];
    [self.interstitial loadRequest:request];
}

- (void)showInterstitial {
    if (!self.interstitial.hasBeenUsed) {
        [self.interstitial presentFromRootViewController: [AdsWrapper getCurrentRootViewController]];
    }
}

- (void)interstitialDidReceiveAd:(GADInterstitial *)interstitial
{
    
}
- (void)interstitial:(GADInterstitial *)interstitial didFailToReceiveAdWithError:(GADRequestError *)error
{
    //If an error occurs and the interstitial is not received you might want to retry automatically after a certain interval
    [NSTimer scheduledTimerWithTimeInterval:3.0f target:self selector:@selector(preLoadInterstitial) userInfo:nil repeats:NO];
    
}
- (void)interstitialWillPresentScreen:(GADInterstitial *)interstitial
{
    
}
- (void)interstitialWillDismissScreen:(GADInterstitial *)interstitial
{
    
}
- (void)interstitialDidDismissScreen:(GADInterstitial *)interstitial
{
    //[interstitial_ loadRequest:[GADRequest request]];
    //An interstitial object can only be used once - so it's useful to automatically load a new one when the current one is dismissed
    NSLog(@"interstitialDidDismissScreen");
    [self preLoadInterstitial];
}
- (void)interstitialWillLeaveApplication:(GADInterstitial *)interstitial
{
    
}

//- (GADInterstitial *)createAndLoadInterstitial {
//    self.interstitial = [[GADInterstitial alloc] init];
//    self.interstitial.adUnitID = @"ca-app-pub-3940256099942544/4411468910";
//    self.interstitial.delegate = self;
////    [self.interstitial loadRequest:[GADRequest request]];
//    return self.interstitial;
//}
//
//- (void) showInterstitial {
//    if (nil != self.interstitial) {
//        [self.interstitial removeFromSuperview];
//        [self.interstitial release];
//        self.interstitial = nil;
//    }
//    [self createAndLoadInterstitial];
//    
//    GADRequest *request = [GADRequest request];
//    // Requests test ads on simulators.
//    request.testDevices = @[ GAD_SIMULATOR_ID ];
////    request.testDevices = [NSArray arrayWithArray:self.testDeviceIDs];
//    [self.interstitial loadRequest:request];
//
//}
//
//- (void)interstitialDidDismissScreen:(GADInterstitial *)interstitial {
//    self.interstitial = [self createAndLoadInterstitial];
//}

#pragma mark interface for Admob SDK

- (void) addTestDevice: (NSString*) deviceID
{
    if (nil == self.testDeviceIDs) {
        self.testDeviceIDs = [[NSMutableArray alloc] init];
        [self.testDeviceIDs addObject:GAD_SIMULATOR_ID];
    }
    [self.testDeviceIDs addObject:deviceID];
}

#pragma mark GADBannerViewDelegate impl

// Since we've received an ad, let's go ahead and set the frame to display it.
- (void)adViewDidReceiveAd:(GADBannerView *)adView {
    NSLog(@"Received ad");
    [AdsWrapper onAdsResult:self withRet:kAdsReceived withMsg:@"Ads request received success!"];
}

- (void)adView:(GADBannerView *)view didFailToReceiveAdWithError:(GADRequestError *)error {
    NSLog(@"Failed to receive ad with error: %@", [error localizedFailureReason]);
    int errorNo = kUnknownError;
    switch ([error code]) {
    case kGADErrorNetworkError:
        errorNo = kNetworkError;
        break;
    default:
        break;
    }
    [AdsWrapper onAdsResult:self withRet:errorNo withMsg:[error localizedDescription]];
}

@end
