import React, { useEffect, useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { RiCloseCircleLine } from "react-icons/ri";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import OTPModal from "../OTPModal/OTPModal";
import { toast } from "react-hot-toast";
import { translate } from "@/utils";
import { useSelector } from "react-redux";
import { Fcmtoken, settingsData } from "@/store/reducer/settingsSlice";
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, RecaptchaVerifier, signInWithPhoneNumber, signInWithPopup } from "firebase/auth";
import FirebaseData from "@/utils/Firebase";
import { signupLoaded } from "@/store/reducer/authSlice";
import { useRouter } from "next/router";
import { PhoneNumberUtil } from "google-libphonenumber";
import Swal from "sweetalert2";
import Link from "next/link";

const LoginModal = ({ isOpen, onClose }) => {
    const SettingsData = useSelector(settingsData);
    const isDemo = SettingsData?.demo_mode;

    const navigate = useRouter();
    const { authentication } = FirebaseData();
    const FcmToken = useSelector(Fcmtoken);

    const DemoNumber = "+919764318246";
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [showOTPContent, setShowOtpContent] = useState(false);
    const [phonenum, setPhonenum] = useState();
    const [value, setValue] = useState(isDemo ? DemoNumber : "");
    const phoneUtil = PhoneNumberUtil.getInstance();
    const [otp, setOTP] = useState("");
    const [resendTimer, setResendTimer] = useState(60);
    const [showLoader, setShowLoader] = useState(true);

    const inputRefs = useRef([]);
    const otpInputRef = useRef(null);

    const generateRecaptcha = () => {
        if (!window?.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(authentication, "recaptcha-container", {
                size: "invisible",
                'callback': (response) => {
                    // Recaptcha callback if needed
                }
            });
        }
    };

    useEffect(() => {
        generateRecaptcha();
        setShowLoader(true);

        return () => {
            if (window.recaptchaVerifier) {
                try {
                    window.recaptchaVerifier.clear();
                } catch (error) {
                    console.error("Error clearing recaptchaVerifier:", error);
                }
            }

            const recaptchaContainer = document.getElementById("recaptcha-container");
            if (recaptchaContainer) {
                recaptchaContainer.innerHTML = "";
            }
        };
    }, []);

    useEffect(() => {
        if (showOTPContent) {
            generateRecaptcha();
        }

    }, []);

    const onSignUp = (e) => {
        e.preventDefault();
        if (!value) {
            toast.error(translate("enterPhoneNumber"));
            return;
        }
        try {
            const phoneNumber = phoneUtil.parseAndKeepRawInput(value, 'ZZ');
            if (!phoneUtil.isValidNumber(phoneNumber)) {
                toast.error(translate("validPhonenum"));
                return;
            }
            setPhonenum(value)
            setShowOtpContent(true);
            setShowLoader(true);
            generateOTP(value);
            if (isDemo) {
                setValue(DemoNumber);
            } else {
                setValue("");
            }
        } catch (error) {
            console.error("Error parsing phone number:", error);
            toast.error(translate("validPhonenum"));
        }
    };

    const handleGoogleSignup = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const response = await signInWithPopup(authentication, provider);
            signupLoaded(
                response?.user?.displayName,
                response?.user?.email,
                "",
                "0",
                "",
                response?.user?.uid,
                "",
                response?.user?.photoURL,
                FcmToken,
                (res) => {
                    let signupData = res.data;
                    if (!res.error) {
                        if (signupData.mobile === "") {
                            navigate.push("/user-register");
                            onCloseLogin();
                        } else {
                            toast.success(res.message);
                            onCloseLogin();
                        }
                    }
                },
                (err) => {
                    if (err === 'Account Deactivated by Administrative please connect to them') {
                        onCloseLogin();
                        Swal.fire({
                            title: "Opps!",
                            text: "Account Deactivated by Administrative please connect to them",
                            icon: "warning",
                            showCancelButton: false,
                            customClass: {
                                confirmButton: 'Swal-confirm-buttons',
                                cancelButton: "Swal-cancel-buttons"
                            },
                            confirmButtonText: "Ok",
                        }).then((result) => {
                            if (result.isConfirmed) {
                                navigate.push("/contact-us");
                            }
                        });
                    }
                }
            );
        } catch (error) {
            console.error(error);
            toast.error(translate("popupCancel"));
        }
    };

    const onCloseLogin = () => {
        onClose();
        setShowOtpContent(false)
        window.recaptchaVerifier = null;
        setResendTimer(60)
    };

    useEffect(() => {
        
    }, [phonenum])

    const generateOTP = (phoneNumber) => {

        let appVerifier = window.recaptchaVerifier;
        signInWithPhoneNumber(authentication, phoneNumber, appVerifier)
            .then((confirmationResult) => {
                window.confirmationResult = confirmationResult;
                toast.success(translate("otpSentsuccess"));
                setShowLoader(false);
                // Handle success
            })
            .catch((error) => {
                console.error("Error generating OTP:", error);
                let errorMessage = "An error occurred. Please try again.";
                if (error.code === "auth/too-many-requests") {
                    errorMessage = "Too many requests. Please try again later.";
                } else if (error.code === "auth/invalid-phone-number") {
                    errorMessage = "Invalid phone number. Please enter a valid phone number.";
                }
                toast.error(errorMessage);
                setShowLoader(false);
            });
    };


    const handleConfirm = (e) => {
        e.preventDefault();

        if (otp === "") {
            toast.error(translate("pleaseEnterOtp"));
            return;
        }

        setShowLoader(true);
        let confirmationResult = window.confirmationResult;
        confirmationResult
            .confirm(otp)
            .then(async (result) => {
                signupLoaded(
                    "",
                    "",
                    result.user.phoneNumber.replace("+", ""),
                    "1",
                    "",
                    result.user.uid,
                    "",
                    "",
                    FcmToken,
                    (res) => {
                        let signupData = res.data;
                        setShowLoader(false);
                        if (!res.error) {
                            if (signupData.name === "" || signupData.email === "") {
                                navigate.push("/user-register");
                                onCloseLogin();
                            } else {
                                toast.success(res.message);
                                onCloseLogin();
                            }
                        }
                    },
                    (err) => {
                        console.log(err);
                        if (err === 'Account Deactivated by Administrative please connect to them') {
                            onCloseLogin();
                            Swal.fire({
                                title: "Opps!",
                                text: "Account Deactivated by Administrative please connect to them",
                                icon: "warning",
                                showCancelButton: false,
                                customClass: {
                                    confirmButton: 'Swal-confirm-buttons',
                                    cancelButton: "Swal-cancel-buttons"
                                },
                                confirmButtonText: "Ok",
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    navigate.push("/contact-us");
                                }
                            });
                        }
                    }
                );
            })
            .catch((error) => {
                console.log(error);
                let errorMessage = "";
                switch (error.code) {
                    case "auth/too-many-requests":
                        errorMessage = "Too many requests. Please try again later.";
                        break;
                    case "auth/invalid-phone-number":
                        errorMessage = "Invalid phone number. Please enter a valid phone number.";
                        break;
                    case "auth/invalid-verification-code":
                        errorMessage = "Invalid OTP number. Please enter a valid OTP number.";
                        break;
                    default:
                        errorMessage = "An error occurred. Please try again.";
                        break;
                }
                toast.error(errorMessage);
                setShowLoader(false);
            });
    };

    const handleChange = (event, index) => {
        const value = event.target.value;
        if (!isNaN(value) && value !== "") {
            setOTP((prevOTP) => {
                const newOTP = [...prevOTP];
                newOTP[index] = value;
                return newOTP.join("");
            });
            if (index < 5) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handleKeyDown = (event, index) => {
        if (event.key === "Backspace" && index > 0) {
            setOTP((prevOTP) => {
                const newOTP = [...prevOTP];
                newOTP[index - 1] = "";
                return newOTP.join("");
            });
            inputRefs.current[index - 1].focus();
        } else if (event.key === "Backspace" && index === 0) {
            setOTP((prevOTP) => {
                const newOTP = [...prevOTP];
                newOTP[0] = "";
                return newOTP.join("");
            });
        }
    };

    useEffect(() => {
        let intervalId;

        if (resendTimer > 0) {
            intervalId = setInterval(() => {
                setResendTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        }

        return () => {
            clearInterval(intervalId);
        };
    }, [resendTimer]);

    const handleResendOTP = () => {
        setResendTimer(60);
        generateOTP(phonenum);
    };

    useEffect(() => {
        if (!showOTPContent && otpInputRef.current) {
            otpInputRef.current.focus();
        }
    }, [showOTPContent]);
    return (
        <>
            <Modal
                show={isOpen}
                onHide={onCloseLogin}
                ize="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered className={`${!showOTPContent ? 'login-modal' : "otp-modal"}`}
                backdrop="static">
                <Modal.Header>
                    {!showOTPContent ? (
                        <Modal.Title>{translate("login&Regiser")}</Modal.Title>

                    ) : (
                        <Modal.Title>{translate("verification")}</Modal.Title>
                    )}
                    <RiCloseCircleLine className="close-icon" size={40} onClick={onCloseLogin} />
                </Modal.Header>
                <Modal.Body>
                    {!showOTPContent ? (

                        <>
                            <form>
                                <div className="modal-body-heading">
                                    <h4>{translate("enterMobile")}</h4>
                                    <span>{translate("sendCode")}</span>
                                </div>
                                <div className="mobile-number">
                                    <label htmlFor="phone">{translate("phoneNumber")}</label>
                                    <PhoneInput
                                        defaultCountry={process.env.NEXT_PUBLIC_DEFAULT_COUNTRY}
                                        disabledCountryCode={false}
                                        countryCallingCodeEditable={true}
                                        international={true}
                                        value={value}
                                        onChange={setValue}
                                        className="custom-phone-input" />
                                </div>
                                <div className="continue">
                                    <button type="submit" className="continue-button" onClick={onSignUp}>
                                        {translate("continue")}
                                    </button>
                                </div>
                            </form>
                            <div className="or_devider">
                                <hr />
                                <span>{translate("or")}</span>
                                <hr />
                            </div>
                            <div className="google_signup" onClick={handleGoogleSignup}>
                                <button className="google_signup_button">
                                    <div className="google_icon">
                                        <FcGoogle size={25} />
                                    </div>
                                    <span className="google_text">
                                        {translate("CWG")}
                                    </span>
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <form>
                                <div className="modal-body-heading">
                                    <h4>{translate("otpVerification")}</h4>
                                    <span>
                                        {translate("enterOtp")} {phonenum}
                                    </span>
                                </div>
                                <div className="userInput">
                                    {Array.from({ length: 6 }).map((_, index) => (
                                        <input
                                            key={index}
                                            className="otp-field"
                                            type="text"
                                            maxLength={1}
                                            value={otp[index] || ""}
                                            onChange={(e) => handleChange(e, index)}
                                            onKeyDown={(e) => handleKeyDown(e, index)}
                                            ref={(inputRef) => (inputRefs.current[index] = inputRef)}
                                        />
                                    ))}
                                </div>

                                <div className="resend-code">
                                    {resendTimer > 0 ? (
                                        <div>
                                            <span className="resend-text"> {translate("resendCodeIn")}</span>
                                            <span className="resend-time">
                                                {" "}
                                                {resendTimer} {translate("seconds")}
                                            </span>
                                        </div>
                                    ) : (
                                        <span id="re-text" onClick={handleResendOTP}>
                                            {translate("resendOtp")}
                                        </span>
                                    )}
                                </div>
                                <div className="continue">
                                    <button type="submit" className="continue-button" onClick={handleConfirm}>
                                        {showLoader ? (
                                            <div className="loader-container-otp">
                                                <div className="loader-otp"></div>
                                            </div>
                                        ) : (
                                            <span>{translate("confirm")}</span>
                                        )}
                                    </button>
                                </div>
                            </form>

                        </>
                    )}
                </Modal.Body>
                {!showOTPContent &&
                    <Modal.Footer>
                        <span>
                            {translate("byclick")} <Link href="/terms-and-condition">{translate("terms&condition")}</Link> <span className="mx-1"> {translate("and")} </span> <Link href="/privacy-policy"> {translate("privacyPolicy")} </Link>
                        </span>
                    </Modal.Footer>
                }
            </Modal>
            <div id="recaptcha-container"></div>
        </>
    );
};

export default LoginModal;
