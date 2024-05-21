import React from "react";
import { Provider } from "react-redux";
import { store } from "../src/store/store";
import { Fragment } from "react";

import "../public/css/style.css";
import "../public/css/responsive.css";
import "bootstrap/dist/css/bootstrap.css";
import "react-loading-skeleton/dist/skeleton.css";



import { Toaster } from "react-hot-toast";
import PushNotificationLayout from "@/Components/firebaseNotification/PushNotificationLayout";
import InspectElement from '@/Components/InspectElement/InspectElement'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";


// provide the default query function to your app with defaultOptions
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 600000,
            refetchOnWindowFocus: false // default: true
        }
    }
})

function MyApp({ Component, pageProps, data }) {

    return (
        <Fragment>

            <link rel="shortcut icon" href="/favicon.ico" sizes="32x32" type="image/png" />
            <QueryClientProvider client={queryClient}>
                <Provider store={store}>
                    <InspectElement>
                        <PushNotificationLayout>
                            <Component {...pageProps} data={data} />
                        </PushNotificationLayout>
                    </InspectElement>
                    <Toaster />
                </Provider>
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </Fragment>
    );
}

export default MyApp;
