"use client"
import React, { useState, useEffect } from 'react'
import Breadcrumb from "@/Components/Breadcrumb/Breadcrumb";
import {  getAllprojectsApi } from "@/store/actions/campaign";
import Pagination from "@/Components/Pagination/ReactPagination";
import { useSelector } from "react-redux";
import { translate } from "@/utils";
import { languageData } from "@/store/reducer/languageSlice";
import NoData from "@/Components/NoDataFound/NoData";
import Layout from '../Layout/Layout';
import ProjectCard from '../Cards/ProjectCard';
import { useRouter } from 'next/router';
import { settingsData } from '@/store/reducer/settingsSlice';
import Swal from 'sweetalert2';
import ProjectCardSkeleton from '../Skeleton/ProjectCardSkeleton';
import LoginModal from '../LoginModal/LoginModal';


const AllProjects = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [projectData, setProjectData] = useState([]);
    const [total, setTotal] = useState(0);
    const [offsetdata, setOffsetdata] = useState(0);
    const router = useRouter()
    const limit = 8;
    const settingData = useSelector(settingsData);
    const isPremiumUser = settingData && settingData.is_premium;
    const isLoggedIn = useSelector((state) => state.User_signup);
    const userCurrentId = isLoggedIn && isLoggedIn.data ? isLoggedIn.data.data.id : null;

    const lang = useSelector(languageData);

    const [showModal, setShowModal] = useState(false);
    const handleCloseModal = () => {
        setShowModal(false);
    };
    const handlecheckPremiumUser = (e, slug_id) => {
        e.preventDefault()
        if (userCurrentId) {
            if (isPremiumUser) {
                router.push(`/project-details/${slug_id}`)
            } else {
                Swal.fire({
                    title: "Opps!",
                    text: "You are not premium user sorry!",
                    icon: "warning",
                    allowOutsideClick: false,
                    showCancelButton: false,
                    customClass: {
                        confirmButton: 'Swal-confirm-buttons',
                        cancelButton: "Swal-cancel-buttons"
                    },
                    confirmButtonText: "Ok",
                }).then((result) => {
                    if (result.isConfirmed) {
                        router.push("/")
                    }
                });
            }
        } else {
            Swal.fire({
                title: translate("plzLogFirsttoAccess"),
                icon: "warning",
                allowOutsideClick: false,
                showCancelButton: false,
                allowOutsideClick: true,
                customClass: {
                    confirmButton: 'Swal-confirm-buttons',
                    cancelButton: "Swal-cancel-buttons"
                },
                confirmButtonText: "Ok",
            }).then((result) => {
                if (result.isConfirmed) {
                    setShowModal(true)
                }
            });
        }
    }


    useEffect(() => { }, [lang]);
    useEffect(() => {
        setIsLoading(true);
        getAllprojectsApi({
            onSuccess: (response) => {
                const ProjectData = response && response.data;
                setIsLoading(false);
                setProjectData(ProjectData);
                setTotal(response.total)

            },
            onError: (error) => {
                setIsLoading(false);
                console.log(error);
            }
        });
    }, [offsetdata, isLoggedIn]);

    const handlePageChange = (selectedPage) => {
        const newOffset = selectedPage.selected * limit;
        setOffsetdata(newOffset);
        window.scrollTo(0, 0);
    };


    return (
        <Layout>
            <Breadcrumb title={translate("projects")} />
            <section id="featured_prop_section">
                {isLoading ? ( // Show Skeleton when isLoading is true
                    <div className="container">
                        <div id="feature_cards" className="row">
                            {Array.from({ length: 8 }).map((_, index) => (
                                <div className="col-sm-12 col-md-6 col-lg-3 loading_data" key={index}>
                                    <ProjectCardSkeleton />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : projectData && projectData.length > 0 ? (
                    <>
                        <div className="container">
                            <div id="feature_cards" className="row">
                                {projectData.map((ele, index) => (
                                    <div className="col-sm-12 col-md-6 col-lg-3" key={index} onClick={(e) => handlecheckPremiumUser(e, ele.slug_id)}>
                                        <ProjectCard ele={ele} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="noDataFoundDiv">
                        <NoData />
                    </div>
                )}
                {total > limit ? (
                    <div id="feature_cards" className="row">
                        <div className="col-12">
                            <Pagination pageCount={Math.ceil(total / limit)} onPageChange={handlePageChange} />
                        </div>
                    </div>
                ) : null}
            </section>

            {showModal &&
                <LoginModal isOpen={showModal} onClose={handleCloseModal} />
            }
        </Layout>
    )
}

export default AllProjects
