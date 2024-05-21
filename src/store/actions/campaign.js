import {
    getCategorieApi,
    getAllProperties,
    getSliderApi,
    update_profile,
    getArticlesApi,
    getCountByCitysCategories,
    addFavourite,
    ContactUs,
    getFav,
    getPackages,
    getPaymentSettings,
    createPaymentIntent,
    confirmPayment,
    getFacilities,
    postProperty,
    postProject,
    getAllProjects,
    getLimits,
    getPaymentDetials,
    updatePostProperty,
    deleteProperty,
    deleteProject,
    featureProperty,
    intrestedProperty,
    getNotificationList,
    assignFreePackage,
    getChatList,
    getChatMessages,
    sendMessage,
    deleteChatMessages,
    deleteUser,
    getReportReasons,
    addReport,
    getNearbyProperties,
    setPropertyTotalClicks,
    changePropertyStatus,
    getIntretsedUsers,
    AddUserIntrest,
    getUserRecommendation,
    getSettingApi,
    GetUserIntrest,
    DeleteUserIntrest
} from "@/utils/api";
import { store } from "../store";
import { apiCallBegan } from "./apiActions";


// system setings api 

export const SystemSettingsApi = ({
    type = "",
    user_id = "",
    onSuccess: { },
    onError: { },
    onStart: { }
}) => {
    store.dispatch(
        apiCallBegan({
            ...getSettingApi(type, user_id),
            displayToast: false,
            onStart,
            onSuccess,
            onError,
        })
    );
}

// update profile
export const UpdateProfileApi = ({
    userid = "",
    name = "",
    email = "",
    mobile = "",
    type = "",
    address = "",
    firebase_id = "",
    logintype = "",
    profile = "",
    latitude = "",
    longitude = "",
    about_me = "",
    facebook_id = "",
    twiiter_id = "",
    instagram_id = "",
    pintrest_id = "",
    fcm_id = "",
    notification = "",
    city = "",
    state = "",
    country = "",
    onSuccess = () => { },
    onError = () => { },
    onStart = () => { } }) => {
    store.dispatch(
        apiCallBegan({
            ...update_profile(userid, name, email, mobile, address, firebase_id, profile, latitude, longitude, about_me, facebook_id, twiiter_id, instagram_id, pintrest_id, fcm_id, notification, city, state, country),
            displayToast: false,
            onStart,
            onSuccess,
            onError,
        })
    );
};

// GET CATEGORIES
export const GetCategorieApi = (onSuccess, onError, onStart) => {
    store.dispatch(
        apiCallBegan({
            ...getCategorieApi(),
            displayToast: false,
            onStart,
            onSuccess,
            onError,
        })
    );
};
// GET PROPERTIES
export const GetFeturedListingsApi = ({
    promoted = "",
    top_rated = "",
    id = "",
    category_id = "",
    most_liked = "",
    city = "",
    get_simiilar = "",
    offset = "",
    limit = "",
    current_user = "",
    property_type = "",
    max_price = "",
    min_price = "",
    posted_since = "",
    state = "",
    country = "",
    search = "",
    userid = "",
    users_promoted = "",
    slug_id = "",
    category_slug_id = "",
    onSuccess = () => { },
    onError = () => { },
    onStart = () => { }

}) => {
    store.dispatch(
        apiCallBegan({
            ...getAllProperties(promoted, top_rated, id, category_id, most_liked, city, get_simiilar, offset, limit, current_user, property_type, max_price, min_price, posted_since, state, country, search, userid, users_promoted, slug_id, category_slug_id),
            displayToast: false,
            onStart,
            onSuccess,
            onError,
        })
    );
};


// GET_ARTICLES
export const GetAllArticlesApi = (id, category_id, get_simiilar, slug_id, onSuccess, onError, onStart) => {
    store.dispatch(
        apiCallBegan({
            ...getArticlesApi(id, category_id, get_simiilar, slug_id),
            displayToast: false,
            onStart,
            onSuccess,
            onError,
        })
    );
};

// GET_COUNT_BY_CITIES_CATEGORIS
export const GetCountByCitysCategorisApi = (onSuccess, onError, onStart) => {
    store.dispatch(
        apiCallBegan({
            ...getCountByCitysCategories(),
            displayToast: false,
            onStart,
            onSuccess,
            onError,
        })
    );
};

// // ADD_FAVOURITE
export const AddFavourite = (property_id, type, onSuccess, onError, onStart) => {
    store.dispatch(
        apiCallBegan({
            ...addFavourite(property_id, type),
            displayToast: false,
            onStart,
            onSuccess,
            onError,
        })
    );
};

// contact us
export const ContactUsApi = (first_name, last_name, email, subject, message, onSuccess, onError, onStart) => {
    store.dispatch(
        apiCallBegan({
            ...ContactUs(first_name, last_name, email, subject, message),
            displayToast: false,
            onStart,
            onSuccess,
            onError,
        })
    );
};

// // GET_FAV_PROPERTY
export const GetFavPropertyApi = (offset, limit, onSuccess, onError, onStart) => {
    store.dispatch(
        apiCallBegan({
            ...getFav(offset, limit),
            displayToast: false,
            onStart,
            onSuccess,
            onError,
        })
    );
};

// get packages
export const getPackagesApi = (onSuccess, onError, onStart) => {
    store.dispatch(
        apiCallBegan({
            ...getPackages(),
            displayToast: false,
            onStart,
            onSuccess,
            onError,
        })
    );
};

// get payement settings

export const getPaymentSettingsApi = (onSuccess, onError, onStart) => {
    store.dispatch(
        apiCallBegan({
            ...getPaymentSettings(),
            displayToast: false,
            onStart,
            onSuccess,
            onError,
        })
    );
};

// createPaymentIntent
export const createPaymentIntentApi = (description, name, address1, postalcode, city, state, country, amount, currency, card, packageID, onSuccess, onError, onStart) => {
    store.dispatch(
        apiCallBegan({
            ...createPaymentIntent(description, name, address1, postalcode, city, state, country, amount, currency, card, packageID),
            displayToast: false,
            onStart,
            onSuccess,
            onError,
        })
    );
};

//confirmPayment
export const confirmPaymentApi = (paymentIntentId, onSuccess, onError, onStart) => {
    store.dispatch(
        apiCallBegan({
            ...confirmPayment(paymentIntentId),
            displayToast: false,
            onStart,
            onSuccess,
            onError,
        })
    );
};

// GET FACILITIES API
export const GetFacilitiesApi = (onSuccess, onError, onStart) => {
    store.dispatch(
        apiCallBegan({
            ...getFacilities(),
            displayToast: false,
            onStart,
            onSuccess,
            onError,
        })
    );
};

export const PostProperty = ({

    userid = "",
    title = "",
    description = "",
    city = "",
    state = "",
    country = "",
    latitude = "",
    longitude = "",
    address = "",
    price = "",
    category_id = "",
    property_type = "",
    video_link = "",
    parameters = [],
    facilities = [],
    title_image = "",
    threeD_image = "",
    gallery_images = [],
    meta_title = "",
    meta_description = "",
    meta_keywords = "",
    meta_image = "",
    rentduration = "",
    is_premium = "",
    onSuccess = () => { },
    onError = () => { },
    onStart = () => { }
}
) => {
    store.dispatch(
        apiCallBegan({
            ...postProperty(userid, title, description, city, state, country, latitude, longitude, address, price, category_id, property_type, video_link, parameters, facilities, title_image, threeD_image, gallery_images, meta_title, meta_description, meta_keywords, meta_image, rentduration, is_premium),
            displayToast: false,
            onStart,
            onSuccess,
            onError,
        })
    );
};
// GET LIMITS API
export const GetLimitsApi = (package_type, onSuccess, onError, onStart) => {
    store.dispatch(
        apiCallBegan({
            ...getLimits(package_type),
            displayToast: false,
            onStart,
            onSuccess,
            onError,
        })
    );
};

// get payment detials
export const getPaymentDetialsApi = (offset, limit, onSuccess, onError, onStart) => {
    store.dispatch(
        apiCallBegan({
            ...getPaymentDetials(offset, limit),
            displayToast: false,
            onStart,
            onSuccess,
            onError,
        })
    );
};

export const UpdatePostProperty = ({
    action_type = "",
    id = "",
    title = "",
    description = "",
    city = "",
    state = "",
    country = "",
    latitude = "",
    longitude = "",
    address = "",
    price = "",
    category_id = "",
    property_type = "",
    video_link = "",
    parameters = [],
    facilities = [],
    title_image = "",
    threeD_image = "",
    gallery_images = [],
    slug_id = "",
    meta_title = "",
    meta_description = "",
    meta_keywords = "",
    meta_image = "",
    rentduration = "",
    is_premium = "",
    onSuccess = () => { },
    onError = () => { },
    onStart = () => { }
}
) => {
    store.dispatch(
        apiCallBegan({
            ...updatePostProperty(
                action_type,
                id,
                title,
                description,
                city,
                state,
                country,
                latitude,
                longitude,
                address,
                price,
                category_id,
                property_type,
                video_link,
                parameters,
                facilities,
                title_image,
                threeD_image,
                gallery_images,
                slug_id,
                meta_title,
                meta_description,
                meta_keywords,
                meta_image,
                rentduration,
                is_premium
            ),
            displayToast: false,
            onStart,
            onSuccess,
            onError,
        })
    );
};

// Delete Property
export const deletePropertyApi = (id, onSuccess, onError, onStart) => {
    store.dispatch(
        apiCallBegan({
            ...deleteProperty(id),
            displayToast: false,
            onStart,
            onSuccess,
            onError,
        })
    );
};
// Delete Property
export const deleteProjectApi = (id, onSuccess, onError, onStart) => {
    store.dispatch(
        apiCallBegan({
            ...deleteProject(id),
            displayToast: false,
            onStart,
            onSuccess,
            onError,
        })
    );
};

// FETAURE PROPERY
export const featurePropertyApi = (property_id, type, image, onSuccess, onError, onStart) => {
    store.dispatch(
        apiCallBegan({
            ...featureProperty(property_id, type, image),
            displayToast: false,
            onStart,
            onSuccess,
            onError,
        })
    );
};
// intrested propery
export const intrestedPropertyApi = (property_id, type, onSuccess, onError, onStart) => {
    store.dispatch(
        apiCallBegan({
            ...intrestedProperty(property_id, type),
            displayToast: false,
            onStart,
            onSuccess,
            onError,
        })
    );
};
// intrested propery
export const getNotificationListApi = (userid, offset, limit, onSuccess, onError, onStart) => {
    store.dispatch(
        apiCallBegan({
            ...getNotificationList(userid, offset, limit),
            displayToast: false,
            onStart,
            onSuccess,
            onError,
        })
    );
};
// intrested propery
export const assignFreePackageApi = (package_id, onSuccess, onError, onStart) => {
    store.dispatch(
        apiCallBegan({
            ...assignFreePackage(package_id),
            displayToast: false,
            onStart,
            onSuccess,
            onError,
        })
    );
};


// GET CHATS API
export const getChatsListApi = (onSuccess, onError, onStart) => {
    store.dispatch(
        apiCallBegan({
            ...getChatList(),
            displayToast: false,
            onStart,
            onSuccess,
            onError,
        })
    );
};
// GET FACILITIES API
export const getChatsMessagesApi = (user_id, property_id, page, per_page, onSuccess, onError, onStart) => {
    store.dispatch(
        apiCallBegan({
            ...getChatMessages(user_id, property_id, page, per_page),
            displayToast: false,
            onStart,
            onSuccess,
            onError,
        })
    );
};
// SEND MESSAGE API
export const sendMessageApi = (sender_id, receiver_id, message, property_id, file, audio, onSuccess, onError, onStart) => {
    store.dispatch(
        apiCallBegan({
            ...sendMessage(sender_id, receiver_id, message, property_id, file, audio),
            displayToast: false,
            onStart,
            onSuccess,
            onError,
        })
    );
};
// DELETE CHAT  MESSAGE API
export const deleteChatMessagesApi = (sender_id, receiver_id, property_id, onSuccess, onError, onStart) => {
    store.dispatch(
        apiCallBegan({
            ...deleteChatMessages(sender_id, receiver_id, property_id),
            displayToast: false,
            onStart,
            onSuccess,
            onError,
        })
    );
};
// Delete user Api 
export const deleteUserApi = (userid, onSuccess, onError, onStart) => {
    store.dispatch(
        apiCallBegan({
            ...deleteUser(userid),
            displayToast: false,
            onStart,
            onSuccess,
            onError,
        })
    );
};

// GET REPORT rEASONS  API
export const GetReportReasonsApi = (onSuccess, onError, onStart) => {
    store.dispatch(
        apiCallBegan({
            ...getReportReasons(),
            displayToast: false,
            onStart,
            onSuccess,
            onError,
        })
    );
};

// GET REPORT rEASONS  API
export const addReportApi = ({
    reason_id = "",
    property_id = "",
    other_message = "",
    onSuccess = () => { },
    onError = () => { },
    onStart = () => { }
}) => {
    store.dispatch(
        apiCallBegan({
            ...addReport(reason_id, property_id, other_message),
            displayToast: false,
            onStart,
            onSuccess,
            onError,
        })
    );
};
// getNearbyProperties  API
export const getNearbyPropertiesApi = ({
    city = "",
    state = "",
    type = "",
    onSuccess = () => { },
    onError = () => { },
    onStart = () => { }
}) => {
    store.dispatch(
        apiCallBegan({
            ...getNearbyProperties(city, state, type),
            displayToast: false,
            onStart,
            onSuccess,
            onError,
        })
    );
};
// setPropertyTotalClicks  API
export const setPropertyTotalClicksApi = ({
    slug_id = "",
    onSuccess = () => { },
    onError = () => { },
    onStart = () => { }
}) => {
    store.dispatch(
        apiCallBegan({
            ...setPropertyTotalClicks(slug_id),
            displayToast: false,
            onStart,
            onSuccess,
            onError,
        })
    );
};
// check properties status   API
export const changePropertyStatusApi = ({
    property_id = "",
    status = "",
    onSuccess = () => { },
    onError = () => { },
    onStart = () => { }
}) => {
    store.dispatch(
        apiCallBegan({
            ...changePropertyStatus(property_id, status),
            displayToast: false,
            onStart,
            onSuccess,
            onError,
        })
    );
};
// get intrested users   API
export const getIntrestedUserApi = ({
    property_id = "",
    slug_id = "",
    limit = "",
    offset = "",
    onSuccess = () => { },
    onError = () => { },
    onStart = () => { }
}) => {
    store.dispatch(
        apiCallBegan({
            ...getIntretsedUsers(property_id, slug_id, limit, offset),
            displayToast: false,
            onStart,
            onSuccess,
            onError,
        })
    );
};


// post project api

export const PostProjectApi = ({
    id = "",
    title = "",
    description = "",
    category_id = "",
    type = "",
    meta_title = "",
    meta_description = "",
    meta_keywords = "",
    meta_image = "",
    city = "",
    state = "",
    country = "",
    latitude = "",
    longitude = "",
    location = "",
    video_link = "",
    image = "",
    plans = "",
    documents = "",
    gallery_images = "",
    remove_documents = "",
    remove_gallery_images = "",
    remove_plans = "",
    onSuccess = () => { },
    onError = () => { },
    onStart = () => { }
}
) => {
    store.dispatch(
        apiCallBegan({
            ...postProject(id, title, description, category_id, type, meta_title, meta_description, meta_keywords, meta_image, city, state, country, latitude, longitude, location, video_link, image, plans, documents, gallery_images, remove_documents, remove_gallery_images, remove_plans),
            displayToast: false,
            onStart,
            onSuccess,
            onError,
        })
    );
};




// GET PROJECTS 

export const getAllprojectsApi = ({
    userid = "",
    id = "",
    slug_id = "",
    search = "",
    get_sililar = "",
    category_id = "",
    city = "",
    state = "",
    country = "",
    posted_since = "",
    offset = "",
    limit = "",
    onSuccess = () => { },
    onError = () => { },
    onStart = () => { }
}
) => {
    store.dispatch(
        apiCallBegan({
            ...getAllProjects(userid, id, slug_id, search, get_sililar, category_id, city, state, country, posted_since, offset, limit),
            displayToast: false,
            onStart,
            onSuccess,
            onError,
        })
    );
};


// AddUserIntrestApi
export const AddUserIntrestApi = ({
    category_ids = "",
    outdoor_facilitiy_ids = "",
    price_range = "",
    property_type = "",
    city = "",
    onSuccess = () => { },
    onError = () => { },
    onStart = () => { }
}
) => {
    store.dispatch(
        apiCallBegan({
            ...AddUserIntrest(category_ids, outdoor_facilitiy_ids, price_range, property_type, city),
            displayToast: false,
            onStart,
            onSuccess,
            onError,
        })
    );
};
// get user intrest 
export const GetUserIntrestApi = ({
    onSuccess = () => { },
    onError = () => { },
    onStart = () => { }
}
) => {
    store.dispatch(
        apiCallBegan({
            ...GetUserIntrest(),
            displayToast: false,
            onStart,
            onSuccess,
            onError,
        })
    );
};
// Delete user intrest 
export const DeleteUserIntrestApi = ({
    onSuccess = () => { },
    onError = () => { },
    onStart = () => { }
}
) => {
    store.dispatch(
        apiCallBegan({
            ...DeleteUserIntrest(),
            displayToast: false,
            onStart,
            onSuccess,
            onError,
        })
    );
};
// getUserRecommendation
export const getUserRecommendationApi = ({
    offset = "",
    limit = "",
    onSuccess = () => { },
    onError = () => { },
    onStart = () => { }
}
) => {
    store.dispatch(
        apiCallBegan({
            ...getUserRecommendation(offset, limit),
            displayToast: false,
            onStart,
            onSuccess,
            onError,
        })
    );
};