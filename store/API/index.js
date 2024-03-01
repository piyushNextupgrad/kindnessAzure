import { APPCONST } from "../constant/globalVar";

export default (() => {
  return {
    LOGIN: APPCONST.API_URL + "api/login",
    ADD_PAGE_STATIC_DATA: APPCONST.API_URL + "api/homePageStaticData",
    HOMEDESCACCOMP: APPCONST.API_URL + "api/getHomeDescAccomAndMeetExecutive",
    HOMEPAGESTATIC: APPCONST.API_URL + "api/getHomePageStaticData",

    ADD_HOME_DESCRIPTION: APPCONST.API_URL + "api/homePageSecDescAccom",
    ADD_HOME_MEET_EXECUTIVE: APPCONST.API_URL + "api/homePageSecMeetExec",

    GET_HOME_DESCRIPTION:
      APPCONST.API_URL + "api/getHomeDescAccomAndMeetExecutive",

    GETINVOLVEDYNAMIC: APPCONST.API_URL + "api/getHomeCampNewsAndSponsPartner",
    GETINVOLVEDINTLIST: APPCONST.API_URL + "api/getEnvolvedInterest",
    DELETEINTERESTLIST: APPCONST.API_URL + "api/envolvedInterest",
    DELETELEARNMORELIST: APPCONST.API_URL + "api/deletelearnMore",
    DELETESignUpList: APPCONST.API_URL + "api/deleteSignUp",

    ADD_SIGNUP_DATA: APPCONST.API_URL + "api/signUp",
    GET_SIGNUP_LIST: APPCONST.API_URL + "api/getSignUp",
    CAMPAIGN_NEWS: APPCONST.API_URL + "api/homePageSecCampNews",
    ADD_HOME_SPONSOR_PARTNER: APPCONST.API_URL + "api/homepageSecSponPartner",

    CAMPDYNAMIC: APPCONST.API_URL + "api/getCampaignPageEquityManagement",
    CAMPDYNAMICADMIN:
      APPCONST.API_URL + "api/getCampaignPageEquityManagementAdmin",
    campaignHeaderContent:
      APPCONST.API_URL + "api/campaignPageEquityManagement",

    contactUs: APPCONST.API_URL + "api/contactUs",
    ADD_CONTACT_FORM_DATA: APPCONST.API_URL + "api/storeUserDataForm",
    EVENTPAGE1: APPCONST.API_URL + "api/eventCategory",
    EVENTPAGE2: APPCONST.API_URL + "api/eventPromoImage",
    EVENTPAGE3: APPCONST.API_URL + "api/getEventPromoImage",
    EVENTMANAGEMENT: APPCONST.API_URL + "api/eventManagement",

    GET_SINGLE_EVENTS: APPCONST.API_URL + "api/getEventManagement",
    GET_ALL_EVENTS: APPCONST.API_URL + "api/getEventManagementFilterData",

    GETINVOLVEDINTEREST: APPCONST.API_URL + "api/envolvedInterest",
    DONATIONPAGE: APPCONST.API_URL + "api/donationFormData",
    DONATIONTYPES: APPCONST.API_URL + "api/donationType",
    DONATIONTYPESTATIC: APPCONST.API_URL + "api/getDonationType",
    DONATEPAGEDYNAMIC: APPCONST.API_URL + "api/getDonationFormData",

    CONTACTUSGET: APPCONST.API_URL + "api/getcontactUs",

    GETEVENTPAGEDYNAMIC: APPCONST.API_URL + "api/getEventCategory",
    EVENTPAGEMEDIA: APPCONST.API_URL + "api/getEventManagement",

    DOWNLOAD_SIGNUP_REPORT: APPCONST.API_URL + "api/getSignUpReport",
    DOWNLOAD_EVENT_LIST: APPCONST.API_URL + "api/downloadEventList",
    DOWNLOAD_REGISTERED_EVENT_USER:
      APPCONST.API_URL + "api/downloadUserEventRegisteredData",
    DOWNLOAD_DONATION_LIST: APPCONST.API_URL + "api/downloadDonationList",
    DOWNLOAD_LEARN_MORE: APPCONST.API_URL + "api/learnMoreListDownload",
    GET_COMMENTS: APPCONST.API_URL + "api/getComments",
    GET_FILTER_COMMENTS: APPCONST.API_URL + "api/getFilteredComments",
    POST_COMMENTS: APPCONST.API_URL + "api/storeComments",
    POST_RSVP: APPCONST.API_URL + "api/storeUserEventSelectionData",
    GET_RSVP: APPCONST.API_URL + "api/getRsvpList",
    DEL_RSVP: APPCONST.API_URL + "api/deleteRsvpListData",
    POST_LEARNMORE: APPCONST.API_URL + "api/learnMore",
    ORDER_PAY: APPCONST.API_URL + "api/order/pay",
    DO_PAYMENT: APPCONST.API_URL + "api/doPayment",
  };
})();
