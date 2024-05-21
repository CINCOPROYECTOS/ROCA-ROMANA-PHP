import Api from '../api/AxiosInterceptors.jsx'
import { SET_PROPERTY_TOTAL_CLICKS } from '@/utils/api'

const setPropertyTotalClicksApi = requestData => {
    const { slug_id } = requestData;
    return Api.post(SET_PROPERTY_TOTAL_CLICKS, {
        slug_id
    });
};

export default setPropertyTotalClicksApi;
