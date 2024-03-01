import React, { useEffect, useState } from "react";
import NewsModal from "../components/NewsModal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Image from "next/image";
import { Spinner } from "react-bootstrap";
import ReactPlayer from "react-player";
import showNotification from "@/helpers/show_notification";
import { newsPageService } from "../../store/services/newsPageService";
import { homePageService } from "@/store/services/homepageServices";
import { getInvolvePageSevices } from "@/store/services";
import AdminLayout from "@/layout/adminLayout";
import {
  getFormatedDate,
  getBase64,
  checkImageOrVideoFromUrl,
  getFileType,
} from "@/store/library/utils";
import { BsYoutube, BsFileEarmarkImage } from "react-icons/bs";
import Link from "next/link";
const Home = () => {
  const currentDate2 = getFormatedDate(new Date(), "YYYY-MM-DD");
  const [startDate, setStartDate] = useState(new Date());
  const [descriptionAccomplishment, setDescriptionAccomplishment] = useState(
    []
  );
  const [meetExeutive, setMeetExeutive] = useState([]);
  const [Mission, setMission] = useState("");
  const [pageStaticContent, setPageStaticContent] = useState("");
  const [headerText, setHeaderText] = useState();
  const [leftImage, setLeftImage] = useState("");
  const [leftImagePreview, setLeftImagePreview] = useState("");
  const [middleImage, setMiddleImage] = useState("");
  const [middleImagePreview, setMiddleImagePreview] = useState("");
  const [rightImage, setRightImage] = useState("");
  const [rightImagePreview, setRightImagePreview] = useState("");
  const [visionText, setVisionText] = useState("");
  const [impactLink, setImpactLink] = useState("");
  const [latestIssueLink, setlatestIssueLink] = useState("");
  const [jobPostLink, setjobPostLink] = useState();
  const [sectionTitle, setSectionTitle] = useState();
  const [sectionPost, setSectionPost] = useState();
  const [sectionMedia, setSectionMedia] = useState();
  const [sectionMediaPreview, setSectionMediaPreview] = useState();

  //////
  const [desTotal, setDesTotal] = useState();
  const [desActive, setDesActive] = useState(0);
  const [desYear, setDesYear] = useState();
  const [desService, setDesService] = useState();

  const [editDesTotal, setEditDesTotal] = useState();
  const [editDesActive, setEditDesActive] = useState(0);
  const [editDesYear, setEditDesYear] = useState();
  const [editDesService, setEditDesService] = useState();

  /////
  const [exeName, setExeName] = useState();
  const [exeTitle, setExeTitle] = useState();
  const [exeMedia, setExeMedia] = useState();
  const [exeMediaPreview, setExeMediaPreview] = useState();
  const [exeDes, setExeDes] = useState();
  const [exeActive, setExeActive] = useState();

  const [editExeName, setEditExeName] = useState();
  const [editExeTitle, setEditExeTitle] = useState();
  const [editExeMedia, setEditExeMedia] = useState();
  const [editExeMediaPreview, setEditExeMediaPreview] = useState();
  const [editExeDes, setEditExeDes] = useState();
  const [editExeActive, setEditExeActive] = useState();

  /////
  const [campTitle, setCampTitle] = useState();
  const [campActive, setCampActive] = useState();
  const [campMedia, setCampMedia] = useState(null);
  const [campMediaPreview, setCampMediaPreview] = useState();
  const [campDate, setCampDate] = useState();
  const [campItem, setCampItem] = useState();
  const [campSection, setCampSection] = useState();

  ////
  const [sponTitle, setSponTitle] = useState();
  const [sponActive, setSponActive] = useState();
  const [sponMedia, setSponMedia] = useState();
  const [sponMediaPreview, setSponMediaPreview] = useState();

  const [editSponTitle, setEditSponTitle] = useState();
  const [editSponActive, setEditSponActive] = useState();
  const [editSponMedia, setEditSponMedia] = useState();

  const [editSponMediaPreview, setEditSponMediaPreview] = useState();

  const [isSubmitingLoader, setIsSubmitingLoader] = useState(false);

  const [newsSectionData, setNewsSectionData] = useState([]);
  const [newsSectionDataBackup, setNewsSectionDataBackup] = useState([]);
  const [sponsorPartnerData, setSponsorPartnerData] = useState([]);
  const [sortedCommentsOfNews, setSortedCommentsOfNews] = useState([]);

  //states for update Campaign News Section
  const [text1, settext1] = useState();
  const [updateDate, setupdateDate] = useState();
  const [updateFile, setupdateFile] = useState();
  const [updateActive, setUpdateActive] = useState(0);
  const [featuredActive, setFeaturedActive] = useState(0);

  const [updateCampSection, setUpdateCampSection] = useState("");

  const [Order, setOrder] = useState("");

  const [CmtCount, setCmtCount] = useState([]);
  const [updateOrder, setUpdateOrder] = useState("");
  const [manageReadmore, setmanageReadmore] = useState(true);
  const [toggleYoutube, setToggleYoutube] = useState(false);
  const [toggleNewsYoutube, setToggleNewsYoutube] = useState(false);
  const [youtubeLinkCampHeader, setyoutubeLinkCampHeader] = useState("");
  const [youtubeLinkCampHeaderNews, setyoutubeLinkCampHeaderNews] =
    useState("");
  const [toggleNewsYT, settoggleNewsYT] = useState(false);
  const [newsupdateYTdata, setnewsupdateYTdata] = useState();
  const [toggleNewsModal, settoggleNewsModal] = useState(false);

  //function to update the table data
  function editFieldData(id, index, sectionName) {
    if (sectionName == "DescriptionAccomplishment") {
      let obj = descriptionAccomplishment?.find(
        (newRowListItem) => newRowListItem?.edit === true
      );
      if (obj?.id == undefined) {
        let data = descriptionAccomplishment[index];
        data.edit = true;

        descriptionAccomplishment[index] = data;
        setDescriptionAccomplishment([...descriptionAccomplishment]);
        setEditDesTotal(data?.column_1);
        setUpdateOrder(data?.order_in_slider);
        setEditDesActive(parseInt(data?.active) ? true : false);
        setEditDesService(data?.column_2);
        setEditDesYear(data?.impactYear);
      } else {
        showNotification("Please Save Last edited field", "Error");
      }
    }

    if (sectionName == "MeetExecutive") {
      let obj = meetExeutive?.find(
        (newRowListItem) => newRowListItem?.edit === true
      );
      if (obj?.id == undefined) {
        let data = meetExeutive[index];
        data.edit = true;

        meetExeutive[index] = data;
        setMeetExeutive([...meetExeutive]);

        setEditExeName(data?.column_1);
        setEditExeTitle(data?.column_2);

        setEditExeMediaPreview(process.env.NEXT_PUBLIC_SITE_URL + data?.media);
        setEditExeDes(data?.description);
        setEditExeActive(parseInt(data?.active) ? true : false);
      }
      if (obj?.id != undefined) {
        showNotification("Please Save Last edited field", "Error");
      }
    }

    if (sectionName == "CampNews") {
      setnewsid(id);
      let obj = newsSectionData?.find(
        (newRowListItem) => newRowListItem?.edit === true
      );

      if (obj?.id == undefined) {
        let data = newsSectionData[index];
        data.edit = true;

        newsSectionData[index] = data;

        setNewsSectionData([...newsSectionData]);

        settext1(data?.title);

        setupdateFile(data?.media);
        setupdateDate(data?.expire_date);

        setUpdateActive(parseInt(data?.active) ? true : false);
        setFeaturedActive(parseInt(data?.featuredItem) ? true : false);
        setUpdateCampSection(data?.news_artical);
        settoggleNewsModal(true);
      }
      if (obj?.id != undefined) {
        showNotification("Please Save Last edited field", "Error");
      }
    }

    if (sectionName == "SponsorPartner") {
      let obj = sponsorPartnerData?.find(
        (newRowListItem) => newRowListItem?.edit === true
      );
      if (obj?.id == undefined) {
        let data = sponsorPartnerData[index];
        data.edit = true;

        sponsorPartnerData[index] = data;
        setSponsorPartnerData([...sponsorPartnerData]);

        setEditSponTitle(data?.title);

        setEditSponMediaPreview(
          data?.media
            ? process.env.NEXT_PUBLIC_SITE_URL + data?.media
            : "/no-img.jpg"
        );
        setEditSponActive(parseInt(data?.active) ? true : false);
      }
      if (obj?.id != undefined) {
        showNotification("Please Save Last edited field", "Error");
      }
    }

    // showNotification("Item Updated", "Success");
  }

  const updateFormData = async (id, sectionName) => {
    let check = 0;
    setIsSubmitingLoader(true);
    try {
      if (sectionName == "DescriptionAccomplishment") {
        if (updateOrder) {
          let OrderStatus = descriptionAccomplishment.filter(
            (item) => item?.order_in_slider == updateOrder && item?.id != id
          );

          if (OrderStatus?.length) {
            setIsSubmitingLoader(false);
            showNotification(
              "This order is already assigned to other slide. Please choose different order for this slide",
              "Error"
            );
            return false;
          }
        }

        if (editDesTotal && editDesService && editDesYear && updateOrder) {
          const formData = new FormData();
          formData.append("updateId", id);
          formData.append("order", updateOrder);

          formData.append("total", editDesTotal);
          formData.append("service", editDesService);
          formData.append("impactyear", editDesYear);
          formData.append("active", editDesActive ? 1 : 0);

          formData.append("secName", "DescAccomplishment");
          const response = await homePageService.addDescription(formData);

          if (response?.data?.success) {
            setIsSubmitingLoader(false);
            showNotification("Record updated successfully", "Success");
            setEditDesTotal("");
            setEditDesActive("");
            setEditDesService("");
            setEditDesYear("");
            setOrder("");
            settoggleNewsModal(false);

            ///////  Call get api ////
            getDesriptionAccomplishmentAndMeetExecutive();
          } else {
            setIsSubmitingLoader(false);
            showNotification(response?.data?.message, "Error");
          }
        } else {
          showNotification(
            "Please fill all fields of Description/Accomplishment section",
            "Error"
          );
        }
      } else if (sectionName == "CampNews") {
        if (featuredActive) {
          let featuredActiveStatus = newsSectionData.filter(
            (item) => item?.featuredItem == "1" && item?.id != id
          );

          if (featuredActiveStatus?.length) {
            setIsSubmitingLoader(false);
            showNotification(
              "Please remove previous news from featured to show this news prominently",
              "Error"
            );
            return false;
          }
        }
        if (toggleNewsYT) {
          try {
            if (text1 && updateDate) {
              setIsSubmitingLoader(true);
              const formData = new FormData();

              formData.append("updateId", id);
              if (text1) {
                formData.append("title", text1);
              }
              if (newsupdateYTdata != "") {
                formData.append("media", newsupdateYTdata);
              }
              if (updateDate) {
                formData.append("date", updateDate);
              }

              if (updateCampSection) {
                formData.append("newsArticle", updateCampSection);
              }

              formData.append("featuredItem", featuredActive ? 1 : 0);
              formData.append("active", updateActive ? 1 : 0);
              formData.append("secName", "camp_news");

              const response = await homePageService.addCampaignNewsData(
                formData
              );

              if (response?.data?.success) {
                setIsSubmitingLoader(false);
                closePopup();
                showNotification(response?.data?.message, "Success");
                ////////////// Get News api ////////////////
                showNewsSection();
                setIsSubmitingLoader(false);

                settext1("");
                setupdateFile("");
                setupdateDate("");
                setUpdateActive("");
                setnewsupdateYTdata("");
              } else {
                setIsSubmitingLoader(false);

                showNotification(response?.data?.message, "Error");
              }
            } else {
              setIsSubmitingLoader(false);

              showNotification(
                "Please fill all fields of Campaign news section",
                "Error"
              );
            }
          } catch (error) {
            setIsSubmitingLoader(false);

            console.error(error);
          }
        } else {
          try {
            if (text1 && updateDate) {
              setIsSubmitingLoader(true);
              const formData = new FormData();

              formData.append("updateId", id);
              if (text1) {
                formData.append("title", text1);
              }
              if (updateFile) {
                if (updateFile && typeof updateFile == "object") {
                  formData.append("media", updateFile);
                }
                console.log(typeof updateFile);
                // if (updateFile) {
                //   formData.append("media", updateFile);
                // }
              }
              if (updateDate) {
                formData.append("date", updateDate);
              }

              if (updateCampSection) {
                formData.append("newsArticle", updateCampSection);
              }

              formData.append("featuredItem", featuredActive ? 1 : 0);
              formData.append("active", updateActive ? 1 : 0);
              formData.append("secName", "camp_news");

              const response = await homePageService.addCampaignNewsData(
                formData
              );

              if (response?.data?.success) {
                closePopup();
                setIsSubmitingLoader(false);
                showNotification(response?.data?.message, "Success");
                ////////////// Get News api ////////////////
                showNewsSection();

                settext1("");
                setupdateFile("");
                setupdateDate("");
                setUpdateActive("");
                setnewsupdateYTdata("");
              } else {
                setIsSubmitingLoader(false);

                showNotification(response?.data?.message, "Error");
              }
            } else {
              setIsSubmitingLoader(false);

              showNotification(
                "Please fill all fields of Campaign news section",
                "Error"
              );
            }
          } catch (error) {
            setIsSubmitingLoader(false);

            console.error(error);
          }
        }
      } else if (sectionName == "SponsorPartner") {
        try {
          setIsSubmitingLoader(true);

          const formData = new FormData();
          formData.append("updateId", id);

          formData.append("title", editSponTitle);
          if (editSponMedia) {
            formData.append("media", editSponMedia);
          }
          formData.append("active", editSponActive ? 1 : 0);
          formData.append("secName", "spon_partner");

          const response = await homePageService.addSponsorPartnerData(
            formData
          );

          if (response?.data?.success) {
            setIsSubmitingLoader(false);
            showNotification(response.data.message, "Success");
            ////////////// Get News api ////////////////
            showNewsSection();
            setEditSponTitle("");
            setEditSponMedia("");
            setSponActive("");
          } else {
            setIsSubmitingLoader(false);

            showNotification(response.data.message, "Error");
          }
        } catch (error) {
          setIsSubmitingLoader(false);

          console.error(error);
        }
      }
    } catch (error) {
      setIsSubmitingLoader(false);

      console.error(error);
    }
  };

  //function to delete the table data - piyush
  async function deleteData(data, sectionName) {
    if (sectionName == "DescriptionAccomplishment") {
      try {
        setIsSubmitingLoader(true);

        const params = { delId: data };
        const delResp = await homePageService.addDescription(params);

        const newDescriptionAccomplishment = descriptionAccomplishment.filter(
          (item) => item.id != data
        );
        setIsSubmitingLoader(false);
        setDescriptionAccomplishment(newDescriptionAccomplishment);
        showNotification("Item deleted", "Success");
      } catch (error) {
        setIsSubmitingLoader(false);
        console.log(error);
      }
    } else if (sectionName == "MeetExecutive") {
      try {
        setIsSubmitingLoader(true);

        const params = { delId: data };
        const delResp2 = await homePageService.addMeetExecutive(params);

        const newMeetExeutive = meetExeutive.filter((item) => item.id != data);
        setMeetExeutive(newMeetExeutive);
        setIsSubmitingLoader(false);

        showNotification("Item deleted", "Success");
      } catch (error) {
        console.log(error);
        setIsSubmitingLoader(false);
      }
    } else if (sectionName == "CampaignNews") {
      try {
        setIsSubmitingLoader(true);

        const params = { delId: data };
        const delResp2 = await homePageService.addCampaignNewsData(params);

        const newNewsSectionData = newsSectionData.filter(
          (item) => item.id != data
        );
        setIsSubmitingLoader(false);
        setNewsSectionData(newNewsSectionData);
        showNotification("Item deleted", "Success");

        closePopup();
      } catch (error) {
        setIsSubmitingLoader(false);

        console.log(error);
      }
    } else if (sectionName == "ExecutiveList") {
      try {
        setIsSubmitingLoader(true);
        const params = { delId: data };
        const delResp2 = await homePageService.addSponsorPartnerData(params);

        const newSponsorPartnerData = sponsorPartnerData.filter(
          (item) => item.id != data
        );
        setSponsorPartnerData(newSponsorPartnerData);
        setIsSubmitingLoader(false);
        showNotification("Item deleted", "Success");
      } catch (error) {
        console.log(error);
        setIsSubmitingLoader(false);
      }
    }
  }

  const homePageStaticContent = async () => {
    try {
      let params = {};
      params.pageName = "home";

      const resp = await homePageService?.pageStaticData(params);

      if (resp?.data?.success) {
        let response = resp?.data?.data[0];

        if (response?.image) {
          response.imageType = checkImageOrVideoFromUrl(response?.image);
        }

        if (response?.image2) {
          response.imageType2 = checkImageOrVideoFromUrl(response?.image2);
        }

        if (response?.image3) {
          response.imageType3 = checkImageOrVideoFromUrl(response?.image3);
        }

        setPageStaticContent(response);

        setHeaderText(response?.header_text);
        setVisionText(response?.page_text);
        setMission(response?.mission_text);
        setImpactLink(response?.impact_link);

        setlatestIssueLink(response?.issue_link);
        setjobPostLink(response?.job_post_link);

        setSectionTitle(response?.section_title);
        setSectionPost(response?.section_post);
      } else {
        setPageStaticContent();
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    homePageStaticContent();
    getDesriptionAccomplishmentAndMeetExecutive();
    showNewsSection();
    fetchALLComments();
  }, []);

  const onchangeFile = async (e, fieldOrSectionName) => {
    if (e.target.files && e.target.files[0]) {
      const img = e?.target?.files[0];

      const fileName = img.name.toLowerCase();

      // Check if the file has an image extension
      if (/\.(tiff|eps|avi|wmv|bmp|flv)$/.test(fileName)) {
        e.target.value = null;
        showNotification("File format not supported.", "Error");
        return;
      }
      if (/\.(jpg|jpeg|png|gif|webp|bmp|jfif)$/.test(fileName)) {
        if (img.size > 6 * 1024 * 1024) {
          e.target.value = null;
          showNotification(
            "Image size exceeds 6MB. Please choose a smaller image.",
            "Error"
          );
          return;
        }
      }

      if (/\.(mp4|mov|Ff4v|swf|mpg|webm)$/.test(fileName)) {
        if (img.size > 100 * 1024 * 1024) {
          e.target.value = null;
          showNotification(
            "Video size exceeds 100MB. Please choose a smaller video.",
            "Error"
          );
          return;
        }
      }

      const uplodingFileType = getFileType(e?.target?.files[0]?.type);

      let fileData = await getBase64(img);

      if (uplodingFileType == "video") {
        if (fieldOrSectionName == "campaign") {
          setCampMedia(img);
          setCampMediaPreview({ src: fileData, filetype: uplodingFileType });
        }

        if (fieldOrSectionName == "middleImage") {
          setMiddleImage(img);
          setMiddleImagePreview(fileData);
          pageStaticContent.imageType2 = uplodingFileType;
          setPageStaticContent({ ...pageStaticContent });
        }
      } else if (uplodingFileType == "image") {
        if (fieldOrSectionName == "sponsorUpdate") {
          setEditSponMedia(img);
          setEditSponMediaPreview(fileData);
        }

        if (fieldOrSectionName == "sponsor") {
          setSponMedia(img);
          setSponMediaPreview(fileData);
        }

        if (fieldOrSectionName == "executive") {
          setExeMedia(img);
          setExeMediaPreview(fileData);
        }

        if (fieldOrSectionName == "editExecutive") {
          setEditExeMedia(img);
          setEditExeMediaPreview(fileData);
        }

        if (fieldOrSectionName == "leftImage") {
          setLeftImage(img);
          setLeftImagePreview(fileData);
        }

        if (fieldOrSectionName == "campaign") {
          setCampMedia(img);
          setCampMediaPreview({ src: fileData, filetype: uplodingFileType });
        }

        if (fieldOrSectionName == "rightImage") {
          setRightImage(img);
          setRightImagePreview(fileData);
        }

        if (fieldOrSectionName == "sectionMedia") {
          setSectionMedia(img);
          setSectionMediaPreview(fileData);
        }

        if (fieldOrSectionName == "middleImage") {
          setMiddleImage(img);
          setMiddleImagePreview(fileData);
          pageStaticContent.imageType2 = uplodingFileType;
          setPageStaticContent({ ...pageStaticContent });
        }
      } else {
        showNotification("Please upload valid file", "Error");
      }

      e.target.value = null;
    }
  };

  const onchangeFileOnlyImage = async (e, fieldOrSectionName) => {
    if (e.target.files && e.target.files[0]) {
      const img = e?.target?.files[0];

      const fileName = img.name.toLowerCase();

      // Check if the file has an image extension
      if (/\.(tiff|eps|avi|wmv|bmp|flv)$/.test(fileName)) {
        e.target.value = null;
        showNotification("File format not supported.", "Error");
        return;
      }
      if (/\.(jpg|jpeg|png|gif|webp|bmp|jfif)$/.test(fileName)) {
        if (img.size > 6 * 1024 * 1024) {
          e.target.value = null;
          showNotification(
            "Image size exceeds 6MB. Please choose a smaller image.",
            "Error"
          );
          return;
        }
      }

      if (/\.(mp4|mov|wmv|mkv|flv|Ff4v|swf)$/.test(fileName)) {
        e.target.value = null;
        showNotification("Please select image only.", "Error");
        return;
      }

      const uplodingFileType = getFileType(e?.target?.files[0]?.type);

      let fileData = await getBase64(img);

      if (uplodingFileType == "video") {
        if (fieldOrSectionName == "campaign") {
          setCampMedia(img);
          setCampMediaPreview({ src: fileData, filetype: uplodingFileType });
        }

        if (fieldOrSectionName == "middleImage") {
          setMiddleImage(img);
          setMiddleImagePreview(fileData);
          pageStaticContent.imageType2 = uplodingFileType;
          setPageStaticContent({ ...pageStaticContent });
        }
      } else if (uplodingFileType == "image") {
        if (fieldOrSectionName == "sponsorUpdate") {
          setEditSponMedia(img);
          setEditSponMediaPreview(fileData);
        }

        if (fieldOrSectionName == "sponsor") {
          setSponMedia(img);
          setSponMediaPreview(fileData);
        }

        if (fieldOrSectionName == "executive") {
          setExeMedia(img);
          setExeMediaPreview(fileData);
        }

        if (fieldOrSectionName == "editExecutive") {
          setEditExeMedia(img);
          setEditExeMediaPreview(fileData);
        }

        if (fieldOrSectionName == "leftImage") {
          setLeftImage(img);
          setLeftImagePreview(fileData);
        }

        if (fieldOrSectionName == "campaign") {
          setCampMedia(img);
          setCampMediaPreview({ src: fileData, filetype: uplodingFileType });
        }

        if (fieldOrSectionName == "rightImage") {
          setRightImage(img);
          setRightImagePreview(fileData);
        }

        if (fieldOrSectionName == "sectionMedia") {
          setSectionMedia(img);
          setSectionMediaPreview(fileData);
        }

        if (fieldOrSectionName == "middleImage") {
          setMiddleImage(img);
          setMiddleImagePreview(fileData);
          pageStaticContent.imageType2 = uplodingFileType;
          setPageStaticContent({ ...pageStaticContent });
        }
      } else {
        showNotification("Please upload valid file", "Error");
      }
    }
  };
  const addDesriptionAccomplishment = async (e) => {
    setIsSubmitingLoader(true);
    let check = 0;
    descriptionAccomplishment.map((item) => {
      if (item?.order_in_slider == Order) {
        check++;
      }
    });
    if (check > 0) {
      setIsSubmitingLoader(false);
      showNotification("Order Already Exist");
    } else {
      try {
        if (desTotal && desService && desYear) {
          const formData = new FormData();
          formData.append("total", desTotal);
          formData.append("service", desService);
          formData.append("impactyear", desYear);
          formData.append("active", desActive ? 1 : 0);
          formData.append("secName", "DescAccomplishment");
          formData.append("order", Order);
          const response = await homePageService.addDescription(formData);

          if (response?.data?.success) {
            setIsSubmitingLoader(false);
            showNotification(response?.data?.message, "Success");
            setDesTotal("");
            setDesActive("");
            setDesService("");
            setDesYear("");
            setOrder("");

            ///////  Call get api ////
            getDesriptionAccomplishmentAndMeetExecutive();
          } else {
            setIsSubmitingLoader(false);
            showNotification(response?.data?.message, "Error");
          }
        } else {
          setIsSubmitingLoader(false);
          showNotification(
            "Please fill all fields of Description/Accomplishment section",
            "Error"
          );
        }
      } catch (error) {
        setIsSubmitingLoader(false);
        console.error(error);
      }
    }
  };

  const showNewsSection = async () => {
    try {
      setIsSubmitingLoader(true);
      let params = {};
      params.sectionName = "camp_news";
      let currentDate = getFormatedDate(new Date(), "YYYY-MM-DD");
      const newsResp = await getInvolvePageSevices.getDynamicData(params);
      if (newsResp?.data?.success) {
        let respData = newsResp?.data?.data?.reverse();
        let campignNews = respData?.filter(
          (item) => item?.sectionName == "camp_news"
        );
        campignNews.sort((a, b) => b.active.localeCompare(a.active));

        console.log("campignNews", campignNews);
        setNewsSectionData(campignNews);
        setNewsSectionDataBackup(campignNews);

        let SponserPartner = respData?.filter(
          (item) => item?.sectionName == "spon_partner"
        );
        setSponsorPartnerData(SponserPartner);
        setIsSubmitingLoader(false);
      }
    } catch (err) {
      setIsSubmitingLoader(false);
      console.log(err);
    }
  };

  const getDesriptionAccomplishmentAndMeetExecutive = async () => {
    try {
      let params = {};
      params.sectionName = "DescAccomplishment";
      const response = await homePageService.homePageDescAccomp(params);

      if (response?.data?.success) {
        let dataResp = response?.data?.data;

        let newData = dataResp.filter(
          (item) => item.sectionName == "DescAccomplishment"
        );
        let meetExeutiveData = dataResp.filter(
          (item) => item.sectionName == "MeetExecutive"
        );

        setMeetExeutive(meetExeutiveData);

        setDescriptionAccomplishment(newData);
        // console.log("DEscAccom", newData);
      } else {
        setDescriptionAccomplishment([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const saveMeetExecutive = async (e) => {
    setIsSubmitingLoader(true);
    try {
      if (exeName && exeTitle && exeDes && exeMedia) {
        const formData = new FormData();
        formData.append("name", exeName);
        formData.append("title", exeTitle);
        formData.append("overview", exeDes);
        formData.append("media", exeMedia ? exeMedia : "");
        formData.append("active", exeActive ? 1 : 0);
        formData.append("secName", "MeetExecutive");

        const response = await homePageService.addMeetExecutive(formData);

        if (response?.data?.success) {
          getDesriptionAccomplishmentAndMeetExecutive();
          setIsSubmitingLoader(false);
          showNotification(response.data.message, "Success");
          setExeActive("");
          setExeDes("");
          setExeMedia("");
          setExeMediaPreview("");
          setExeName("");
          setExeTitle("");
        } else {
          setIsSubmitingLoader(false);
          showNotification(response.data.message, "Error");
        }
      } else {
        setIsSubmitingLoader(false);
        showNotification(
          "Please fill all fields of Meet Executive section",
          "Error"
        );
      }
    } catch (error) {
      setIsSubmitingLoader(false);
      console.error(error);
    }
  };

  const updateMeetExecutive = async (id) => {
    try {
      setIsSubmitingLoader(true);
      const formData = new FormData();
      formData.append("updateId", id);
      if (editExeName) {
        formData.append("name", editExeName);
      }

      if (editExeTitle) {
        formData.append("title", editExeTitle);
      }

      if (editExeDes) {
        formData.append("overview", editExeDes);
      }

      if (editExeMedia) {
        formData.append("media", editExeMedia);
      }

      formData.append("active", editExeActive ? 1 : 0);

      formData.append("secName", "MeetExecutive");

      const response = await homePageService.addMeetExecutive(formData);

      if (response?.data?.success) {
        setIsSubmitingLoader(false);
        showNotification(response.data.message, "Success");
        getDesriptionAccomplishmentAndMeetExecutive();
        setEditExeActive("");
        setEditExeDes("");
        setEditExeMedia("");
        setEditExeMediaPreview("");
        setEditExeName("");
        setEditExeTitle("");
      } else {
        showNotification(response.data.message, "Error");
        setIsSubmitingLoader(false);
      }
    } catch (error) {
      console.error(error);
      setIsSubmitingLoader(false);
    }
  };

  const updateCampNews = async (e) => {
    if (toggleNewsYoutube) {
      try {
        if (campItem) {
          let featuredActiveStatus = newsSectionData.filter(
            (item) => item?.featuredItem == "1"
          );

          if (featuredActiveStatus?.length) {
            showNotification(
              "Please remove previous news from featured section",
              "Error"
            );
            return false;
          }
        }

        console.log("campDate", campDate, startDate);
        if (campTitle && youtubeLinkCampHeaderNews && campDate) {
          setIsSubmitingLoader(true);
          const formData = new FormData();
          formData.append("title", campTitle);
          formData.append("media", youtubeLinkCampHeaderNews);
          formData.append("date", campDate);
          formData.append("newsArticle", campSection);

          formData.append("featuredItem", campItem ? 1 : 0);
          formData.append("active", campActive ? 1 : 0);
          formData.append("secName", "camp_news");

          const response = await homePageService.addCampaignNewsData(formData);

          if (response?.data?.success) {
            setCampTitle("");
            showNewsSection();
            showNotification(response?.data?.message, "Success");
            setIsSubmitingLoader(false);

            setCampActive("");
            setStartDate("");
            setCampDate("");
            setCampItem("");
            setCampMedia(null);
            setCampMediaPreview(null);
            setCampSection("");
          } else {
            setIsSubmitingLoader(false);
            showNotification(response.data.message, "Error");
          }
        } else {
          showNotification(
            "Please fill all fields of Campaign news section",
            "Error"
          );
        }
        console.log("==>campTitle", campTitle);
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        if (campItem) {
          let featuredActiveStatus = newsSectionData.filter(
            (item) => item?.featuredItem == "1"
          );

          if (featuredActiveStatus?.length) {
            showNotification(
              "Please remove previous news from featured section",
              "Error"
            );
            return false;
          }
        }
        console.log("campDate", campDate, startDate);

        if (campTitle && campMedia && campDate) {
          setIsSubmitingLoader(true);
          const formData = new FormData();
          formData.append("title", campTitle);
          formData.append("media", campMedia);
          formData.append("date", campDate);
          formData.append("newsArticle", campSection);

          formData.append("featuredItem", campItem ? 1 : 0);
          formData.append("active", campActive ? 1 : 0);
          formData.append("secName", "camp_news");

          const response = await homePageService.addCampaignNewsData(formData);

          if (response?.data?.success) {
            showNewsSection();
            showNotification(response?.data?.message, "Success");
            setIsSubmitingLoader(false);
            setCampTitle("");
            setCampActive("");
            setStartDate("");
            setCampDate("");
            setCampItem("");

            setCampMedia(null);
            setCampMediaPreview(null);
            setCampSection("");
          } else {
            setIsSubmitingLoader(false);
            showNotification(response.data.message, "Error");
          }
        } else {
          showNotification(
            "Please fill all fields of Campaign news section",
            "Error"
          );
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  const updateSponPartner = async (e) => {
    setIsSubmitingLoader(true);
    try {
      if (sponTitle && sponMedia) {
        const formData = new FormData();

        formData.append("title", sponTitle);
        formData.append("media", sponMedia);
        formData.append("active", sponActive ? 1 : 0);
        formData.append("secName", "spon_partner");

        const response = await homePageService.addSponsorPartnerData(formData);

        if (response?.data?.success) {
          showNewsSection();
          setIsSubmitingLoader(false);
          showNotification(response.data.message, "Success");
          setSponActive("");
          setSponTitle("");
          setSponMedia("");
          setSponMediaPreview("");
        } else {
          setIsSubmitingLoader(false);
          showNotification(response.data.message, "Error");
        }
      } else {
        setIsSubmitingLoader(false);
        showNotification(
          "Please fill all fields of Sponsor partner section",
          "Error"
        );
        setIsSubmitingLoader(false);
      }
    } catch (error) {
      showNotification(error?.message);
      setIsSubmitingLoader(false);
    }
  };

  // Homepage Static API //

  const updateStaticContent = async (fieldname) => {
    try {
      setIsSubmitingLoader(true);

      let message = "";
      var form_data = new FormData();
      form_data.append("pageName", "home");

      if (fieldname == "headerText") {
        message = "Header Text Updated Successfully";
        form_data.append("headerText", headerText);
      }

      if (fieldname == "leftImage") {
        message = "Image Uploaded Successfully";
        form_data.append("leftImage", leftImage);
      }

      if (fieldname == "middleImage") {
        message = "File Uploaded Successfully";
        form_data.append("middleImage", middleImage);
      }
      if (fieldname == "youtube") {
        message = "Youtube Media Uploaded Successfully";
        form_data.append("middleImage", youtubeLinkCampHeader);
      }

      if (fieldname == "rightImage") {
        message = "Image Uploaded Successfully";
        form_data.append("rightImage", rightImage);
      }

      if (fieldname == "vissionText") {
        message = "Text Updated Successfully";
        form_data.append("vissionText", visionText);
      }

      if (fieldname == "impactLink") {
        message = "Link Updated Successfully";
        form_data.append("impactLink", impactLink);
      }

      if (fieldname == "latestIssueLink") {
        message = "Link Updated Successfully";
        form_data.append("latestIssueLink", latestIssueLink);
      }

      if (fieldname == "jobPostLink") {
        message = "Link Updated Successfully";
        form_data.append("jobPostLink", jobPostLink);
      }
      if (fieldname == "MissionText") {
        message = "Text Updated Successfully";
        form_data.append("missionText", Mission);
      }

      const resp = await homePageService.addPageStaticContent(form_data);

      if (resp?.data?.success) {
        showNotification(message, "Success");
        setIsSubmitingLoader(false);
        homePageStaticContent();
        setMission("");
        setLeftImage("");
        setRightImage("");
        setMiddleImage("");

        setSectionPost("");

        setlatestIssueLink("");
      } else {
        showNotification(resp?.data?.message, "Error");
        setIsSubmitingLoader(false);
      }
    } catch (error) {
      setIsSubmitingLoader(false);
    }
  };

  const addMeetOurFounder = async () => {
    try {
      setIsSubmitingLoader(true);
      var form_data = new FormData();
      form_data.append("pageName", "home");

      if (sectionTitle) {
        form_data.append("section_title", sectionTitle);
      }
      if (sectionPost) {
        form_data.append("section_post", sectionPost);
      }
      if (sectionMedia) {
        form_data.append("section_media", sectionMedia);
      }

      const resp = await homePageService.addPageStaticContent(form_data);

      if (resp?.data?.success) {
        setIsSubmitingLoader(false);

        showNotification(resp?.data?.message, "Success");
      } else {
        setIsSubmitingLoader(false);

        showNotification(resp?.data?.message, "Error");
      }
    } catch (error) {
      setIsSubmitingLoader(false);
    }
  };

  const setDateFormate = (data) => {
    let date = getFormatedDate(data, "YYYY-MM-DD");
    setCampDate(date);
  };

  //function to fetch comments
  /*  async function fetchComments(params, title) {
     setNews_title(title);
     setNews_ID(params);
     try {
       setIsSubmitingLoader(true);
       const resp = await newsPageService.getComments(params);
       // console.log("Comments ===>", resp);
 
       const sortedComments = resp.data.data.filter(
         (item) => item.post_id == params
       );
       // console.log("sortedCommentsOfNews", sortedComments);
       setmanageCmtNotification(manageCmtNotification + 1);
       setSortedCommentsOfNews(sortedComments);
       setIsSubmitingLoader(false);
     } catch (error) {
       setIsSubmitingLoader(false);
       console.log(error);
     }
   } */

  async function fetchALLComments(params) {
    try {
      setIsSubmitingLoader(true);
      const resp = await newsPageService.getComments(params);
      setCmtCount(resp?.data?.data);
      setIsSubmitingLoader(false);
    } catch (error) {
      setIsSubmitingLoader(false);
      console.log(error);
    }
  }

  function getCommentCount(id) {
    const count = CmtCount?.filter((item) => item.post_id == id);
    return count.length;
  }

  function closePopup() {
    showNewsSection();
    // setNewsSectionData(newsSectionDataBackup);
    settoggleNewsModal(false);
  }

  const [newsid, setnewsid] = useState("");

  useEffect(() => {
    console.log(updateFile);
  }, [updateFile]);

  return (
    <>
      <AdminLayout title={"Admin panel"}>
        <main role="main">
          <NewsModal
            newsid={newsid}
            deleteData={deleteData}
            updateFormData={updateFormData}
            editFieldData={editFieldData}
            toggleNewsModal={toggleNewsModal}
            settoggleNewsModal={settoggleNewsModal}
            text1={text1}
            settext1={settext1}
            toggleNewsYT={toggleNewsYT}
            settoggleNewsYT={settoggleNewsYT}
            updateDate={updateDate}
            setupdateDate={setupdateDate}
            updateCampSection={updateCampSection}
            setUpdateCampSection={setUpdateCampSection}
            setFeaturedActive={setFeaturedActive}
            featuredActive={featuredActive}
            updateActive={updateActive}
            setUpdateActive={setUpdateActive}
            newsupdateYTdata={newsupdateYTdata}
            setnewsupdateYTdata={setnewsupdateYTdata}
            showVideo={showVideo}
            updateFile={updateFile}
            setupdateFile={setupdateFile}
            newsSectionDataBackup={newsSectionDataBackup}
            newsSectionData={newsSectionData}
            setNewsSectionData={setNewsSectionData}
            setNewsSectionDataBackup={setNewsSectionDataBackup}
            closePopup={closePopup}
          />
          {isSubmitingLoader ? (
            <div className="overlay">
              <div className="spinner-container">
                <Spinner
                  className="loaderSpinnerPiyush"
                  style={{
                    width: "100px",
                    height: "100px",
                    color: "#0a1c51fc",
                  }}
                  animation="border"
                />
              </div>
            </div>
          ) : null}
          <>
            <section className="panel important">
              <h2>
                {" "}
                <i
                  className="fa fa-hand-o-right"
                  aria-hidden="true"
                  style={{ color: "#ff651f" }}
                />{" "}
                Mission & Vision
              </h2>
              <div className="container">
                <label className="form-label-1" htmlFor="typeText">
                  Page Header Text
                </label>
                <div className="row">
                  <div className="col-md-9">
                    <div className="form-outline">
                      <textarea
                        className="form-control reduceFont"
                        placeholder="Type here"
                        name="headerText"
                        onChange={(e) => setHeaderText(e?.target?.value)}
                        value={headerText}
                      ></textarea>
                    </div>
                  </div>

                  <div className="col-md-3">
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => updateStaticContent("headerText")}
                        className="btn btn btn-outline-primary align-bottom updateBtnSize"
                      >
                        Update Site
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <br /> <br />
              <div className="container upload_container">
                <div className="row">
                  <div className="col-md-3">
                    <label className="form-label-1" htmlFor="typeText">
                      Left Media
                    </label>
                  </div>

                  <div className="col-md-3">
                    {pageStaticContent?.imageType == "video" ? (
                      <ReactPlayer
                        url={
                          pageStaticContent?.image
                            ? process.env.NEXT_PUBLIC_SITE_URL +
                              pageStaticContent?.image
                            : "demo-video.mp4"
                        }
                        controls
                        playing={false}
                        muted={true}
                        width={"100%"}
                        height={80}
                      />
                    ) : (
                      <Image
                        src={
                          leftImagePreview
                            ? leftImagePreview
                            : pageStaticContent?.image
                            ? process.env.NEXT_PUBLIC_SITE_URL +
                              pageStaticContent?.image
                            : "/no-img.jpg"
                        }
                        width={80}
                        height={80}
                        alt="left image"
                      />
                    )}
                    {/* <Image src={leftImagePreview ? leftImagePreview : pageStaticContent?.image ? process.env.NEXT_PUBLIC_SITE_URL + pageStaticContent?.image : "/no-img.jpg"} width={80} height={80} alt="Picture of the author" /> */}
                  </div>

                  <div className="col-md-3">
                    <input
                      type="file"
                      name="leftImage"
                      onChange={(e) => onchangeFileOnlyImage(e, "leftImage")}
                    />
                    <span className="mbSpan">
                      Max file size for images is 6 MB
                    </span>
                  </div>

                  <div className="col-md-3">
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => updateStaticContent("leftImage")}
                        className="btn btn btn-outline-primary align-bottom updateBtnSize"
                      >
                        Update Site
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <br />
              <div className="container upload_container">
                <div className="row">
                  {toggleYoutube ? (
                    <>
                      <div className="container">
                        <div className="row">
                          <div className="col-md-3">
                            <label className="form-label" htmlFor="typeText">
                              Youtube Media
                            </label>
                          </div>
                          <div className="col-md-3">
                            {youtubeLinkCampHeader != ""
                              ? showVideo(youtubeLinkCampHeader)
                              : showVideo("no-video")}
                          </div>
                          <div className="col-md-3">
                            <input
                              className="form-control"
                              type="text"
                              value={youtubeLinkCampHeader}
                              onChange={(e) => {
                                const inputValue = e.target.value.trim();
                                setyoutubeLinkCampHeader(inputValue);
                              }}
                            />
                            <span className="mbSpan">
                              Add YouTube video link.
                            </span>
                          </div>

                          <div className="col-md-3">
                            <button
                              type="button"
                              className="btn btn-outline-primary updateBtnSize"
                              onClick={() => updateStaticContent("youtube")}
                            >
                              Update Site
                            </button>
                          </div>
                        </div>
                        <p className="text-center my-4">OR</p>
                        <div className="text-center youTubeOption2">
                          <BsFileEarmarkImage id="youTubelogo" />
                          <span
                            className="mx-4 custom-youtube-toggleLink"
                            onClick={() => {
                              toggleYoutube
                                ? setToggleYoutube(false)
                                : (setToggleYoutube(true),
                                  setyoutubeLinkCampHeader(""));
                            }}
                          >
                            Custom Video
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="col-md-3">
                        <label className="form-label-1" htmlFor="typeText">
                          Middle Media
                        </label>
                      </div>
                      <div className="col-md-3">
                        {pageStaticContent?.imageType2 == "video" ? (
                          <ReactPlayer
                            url={
                              middleImagePreview
                                ? middleImagePreview
                                : pageStaticContent?.image2
                                ? process.env.NEXT_PUBLIC_SITE_URL +
                                  pageStaticContent?.image2
                                : "demo-video.mp4"
                            }
                            playing={false}
                            muted={true}
                            width={"50%"}
                            height={80}
                          />
                        ) : (
                          <Image
                            src={
                              middleImagePreview
                                ? middleImagePreview
                                : pageStaticContent?.image2
                                ? process.env.NEXT_PUBLIC_SITE_URL +
                                  pageStaticContent?.image2
                                : "/no-img.jpg"
                            }
                            width={80}
                            height={80}
                            alt="middle-media"
                          />
                        )}
                      </div>

                      <div className="col-md-3">
                        <input
                          type="file"
                          name="middleImage"
                          onChange={(e) => onchangeFile(e, "middleImage")}
                        />
                        <span className="mbSpan">
                          Max file size for image is 6 MB , video 100MB
                        </span>
                      </div>

                      <div className="col-md-3">
                        <div className="text-right">
                          <button
                            type="button"
                            onClick={() => updateStaticContent("middleImage")}
                            className="btn btn btn-outline-primary align-bottom updateBtnSize"
                          >
                            Update Site
                          </button>
                        </div>
                      </div>
                      <div
                        style={{ width: "100%" }}
                        className="d-flex justify-content-center align-items-center youTubeOption2"
                      >
                        <BsYoutube id="youTubelogo" />
                        <span
                          className="mx-4 custom-youtube-toggleLink"
                          onClick={() => {
                            toggleYoutube
                              ? setToggleYoutube(false)
                              : setToggleYoutube(true);
                          }}
                        >
                          YouTube Link
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <br />
              <div className="container upload_container">
                <div className="row">
                  <div className="col-md-3">
                    <label className="form-label-1" htmlFor="typeText">
                      Right Media
                    </label>
                  </div>

                  <div className="col-md-3">
                    {pageStaticContent?.imageType3 == "video" ? (
                      <ReactPlayer
                        url={
                          pageStaticContent?.image3
                            ? process.env.NEXT_PUBLIC_SITE_URL +
                              pageStaticContent?.image3
                            : "demo-video.mp4"
                        }
                        playing={false}
                        muted={true}
                        width={"50%"}
                        height={80}
                      />
                    ) : (
                      <Image
                        src={
                          rightImagePreview
                            ? rightImagePreview
                            : pageStaticContent?.image3
                            ? process.env.NEXT_PUBLIC_SITE_URL +
                              pageStaticContent?.image3
                            : "/no-img.jpg"
                        }
                        width={80}
                        height={80}
                        alt="right-media"
                      />
                    )}
                  </div>
                  <div className="col-md-3">
                    <input
                      type="file"
                      name="rightImage"
                      onChange={(e) => onchangeFileOnlyImage(e, "rightImage")}
                    />
                    <span className="mbSpan">
                      Upload image only, Size must be 6MB
                    </span>
                  </div>

                  <div className="col-md-3">
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => updateStaticContent("rightImage")}
                        className="btn btn btn-outline-primary align-bottom updateBtnSize"
                      >
                        Update Site
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <br />
              <br />
              {/* Compleate  */}
              <div className="container">
                <label className="form-label-1" htmlFor="typeText">
                  Mission Text
                </label>
                <div className="row">
                  <div className="col-md-9">
                    <div className="form-outline">
                      <textarea
                        className="form-control reduceFont"
                        placeholder="Type here"
                        name="vissionText"
                        onChange={(e) => setMission(e?.target?.value)}
                        value={Mission}
                      ></textarea>
                    </div>
                  </div>

                  <div className="col-md-3 ">
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => updateStaticContent("MissionText")}
                        className="btn btn btn-outline-primary align-bottom updateBtnSize"
                      >
                        Update Site
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="container">
                <label className="form-label-1" htmlFor="typeText">
                  Vision Text
                </label>
                <div className="row">
                  <div className="col-md-9">
                    <div className="form-outline">
                      <textarea
                        className="form-control reduceFont"
                        placeholder="Type here"
                        name="vissionText"
                        onChange={(e) => setVisionText(e?.target?.value)}
                        value={visionText}
                      ></textarea>
                    </div>
                  </div>

                  <div className="col-md-3 ">
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => updateStaticContent("vissionText")}
                        className="btn btn btn-outline-primary align-bottom updateBtnSize updateBtnSize"
                      >
                        Update Site
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="panel important">
              <h2>
                <i
                  className="fa fa-hand-o-right"
                  aria-hidden="true"
                  style={{ color: "#ff651f" }}
                />{" "}
                Description/Accomplishment
              </h2>
              <span className="mbSpan5">
                &nbsp;Note - Please dont add '+' symbol with total.
              </span>
              <div className="container">
                <div className="row">
                  <div className="col-md-12">
                    <div className="table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Order</th>
                            <th>Total</th>
                            <th>Service</th>
                            <th>Impact Year </th>
                            <th>Active</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {descriptionAccomplishment?.length
                            ? descriptionAccomplishment?.map((item, index) => {
                                return (
                                  <tr key={item?.id + index}>
                                    {item?.edit ? (
                                      <>
                                        <td>
                                          <input
                                            type="number"
                                            name="order"
                                            value={updateOrder}
                                            onChange={(e) =>
                                              setUpdateOrder(
                                                checkIsNumber(e?.target?.value)
                                                  ? e?.target?.value
                                                  : ""
                                              )
                                            }
                                          />
                                        </td>

                                        <td>
                                          <input
                                            type="text"
                                            name="total"
                                            value={editDesTotal}
                                            onChange={(e) =>
                                              setEditDesTotal(e?.target?.value)
                                            }
                                          />
                                        </td>
                                        <td>
                                          <input
                                            type="text"
                                            name="Service"
                                            value={editDesService}
                                            onChange={(e) =>
                                              setEditDesService(
                                                e?.target?.value
                                              )
                                            }
                                          />
                                        </td>
                                        <td>
                                          <input
                                            type="number"
                                            name="year"
                                            value={editDesYear}
                                            onChange={(e) =>
                                              setEditDesYear(e?.target?.value)
                                            }
                                          />
                                        </td>
                                        <td>
                                          <input
                                            type="checkbox"
                                            name="status"
                                            checked={editDesActive}
                                            id="active"
                                            onChange={(e) =>
                                              setEditDesActive(
                                                e?.target?.checked
                                              )
                                            }
                                          />
                                          {/* <span className="btn ">
                                      {item?.active ? "Yes" : "No"}
                                    </span> */}
                                        </td>
                                      </>
                                    ) : (
                                      <>
                                        <td>{item?.order_in_slider}</td>
                                        <td>{item?.column_1}+ </td>
                                        <td>{item?.column_2}</td>
                                        <td>{item?.impactYear}</td>
                                        <td>
                                          {parseInt(item?.active)
                                            ? "Yes"
                                            : "No"}
                                        </td>
                                      </>
                                    )}

                                    <td>
                                      <button
                                        className="btn btn-primary mx-1"
                                        onClick={() =>
                                          item?.edit
                                            ? updateFormData(
                                                item?.id,
                                                "DescriptionAccomplishment"
                                              )
                                            : editFieldData(
                                                item?.id,
                                                index,
                                                "DescriptionAccomplishment"
                                              )
                                        }
                                      >
                                        {item?.edit ? (
                                          <i
                                            className="fa fa-floppy-o"
                                            aria-hidden="true"
                                          />
                                        ) : (
                                          <i
                                            className="fa fa-pencil-square-o"
                                            aria-hidden="true"
                                          />
                                        )}
                                      </button>

                                      <button
                                        className="btn btn-secondary"
                                        onClick={() =>
                                          deleteData(
                                            item?.id,
                                            "DescriptionAccomplishment"
                                          )
                                        }
                                      >
                                        <i
                                          className="fa fa-trash-o"
                                          aria-hidden="true"
                                        />
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })
                            : ""}
                        </tbody>
                      </table>
                    </div>

                    <br />
                    <br />

                    <div className="container">
                      <div className="row">
                        <div className="col-md-2">
                          <label htmlFor="order" className="form-label-1">
                            Order
                          </label>
                          <input
                            type="number"
                            name="order"
                            value={Order}
                            onChange={(e) => setOrder(e?.target?.value)}
                          />
                        </div>
                        <div className="col-md-2">
                          <label htmlFor="total" className="form-label-1">
                            Total
                          </label>
                          <input
                            type="text"
                            name="total"
                            value={desTotal}
                            onChange={(e) => setDesTotal(e?.target?.value)}
                          />
                        </div>

                        <div className="col-md-4">
                          <label htmlFor="Service" className="form-label-1">
                            Service
                          </label>
                          <br />
                          <input
                            type="text"
                            name="Service"
                            value={desService}
                            onChange={(e) => setDesService(e?.target?.value)}
                          />
                        </div>

                        <div className="col-md-2">
                          <label htmlFor="Year" className="form-label-1">
                            Year
                          </label>
                          <input
                            type="text"
                            name="year"
                            value={desYear}
                            onChange={(e) => setDesYear(e?.target?.value)}
                          />
                        </div>

                        <div className="col-md-2 " style={{ bottom: "-50px" }}>
                          <label className="form-check-label">
                            Active &nbsp;
                          </label>
                          <input
                            type="checkbox"
                            name="status"
                            checked={desActive}
                            id="active"
                            onChange={(e) => setDesActive(e?.target?.checked)}
                          />
                        </div>

                        <div className="col-md-12">
                          <div className="text-right">
                            <button
                              type="button"
                              onClick={(e) => addDesriptionAccomplishment(e)}
                              className="btn btn btn-outline-primary align-bottom updateBtnSize updateBtnSize"
                            >
                              Update Site
                            </button>
                          </div>
                        </div>

                        <div className="col-md-12">
                          <label htmlFor="total" className="form-label-1">
                            IMPACT Link
                          </label>
                          <input
                            type="text"
                            className="form-control reduceFont"
                            name="impactLink"
                            value={impactLink}
                            onChange={(e) => setImpactLink(e?.target?.value)}
                          />
                        </div>

                        <div className="col-md-12">
                          <div className="text-right">
                            <button
                              type="button"
                              onClick={() => updateStaticContent("impactLink")}
                              className="btn btn btn-outline-primary align-bottom updateBtnSize"
                            >
                              Update Site
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="panel important">
              <h2>
                {" "}
                <i className="fa fa-hand-o-right" aria-hidden="true"></i> Meet
                Executives
              </h2>

              <div className="container">
                <label className="form-label-1" htmlFor="typeText">
                  Executive List
                </label>
                <div className="row">
                  <div className="col-md-12">
                    <div className="table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            {/* <th>Order</th> */}
                            <th>Name</th>
                            <th>Title</th>
                            <th>Overview </th>
                            <th>Image </th>
                            <th>Active</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {meetExeutive?.length
                            ? meetExeutive.map((item, index) => {
                                return (
                                  <tr key={item?.id + index}>
                                    {/* <td>{index + 1}</td> */}
                                    {item?.edit ? (
                                      <>
                                        <td>
                                          <input
                                            type="text"
                                            value={editExeName}
                                            onChange={(e) =>
                                              setEditExeName(e?.target?.value)
                                            }
                                          />
                                        </td>
                                        <td>
                                          <input
                                            type="text"
                                            value={editExeTitle}
                                            onChange={(e) =>
                                              setEditExeTitle(e?.target?.value)
                                            }
                                          />
                                        </td>
                                        <td>
                                          <textarea
                                            className="form-control "
                                            placeholder="Type here"
                                            id="floatingTextarea"
                                            value={editExeDes}
                                            onChange={(e) =>
                                              setEditExeDes(e?.target?.value)
                                            }
                                          ></textarea>
                                        </td>

                                        <td>
                                          <Image
                                            src={
                                              editExeMediaPreview
                                                ? editExeMediaPreview
                                                : "/no-img.jpg"
                                            }
                                            width={80}
                                            height={80}
                                            alt={editExeTitle}
                                          />
                                          <input
                                            type="file"
                                            onChange={(e) =>
                                              onchangeFile(e, "editExecutive")
                                            }
                                          />
                                        </td>
                                        <td>
                                          <span className="btn ">
                                            <input
                                              type="checkbox"
                                              checked={editExeActive}
                                              id="active"
                                              onChange={(e) =>
                                                setEditExeActive(
                                                  e?.target?.checked
                                                )
                                              }
                                            />
                                          </span>
                                        </td>
                                      </>
                                    ) : (
                                      <>
                                        <td className="fixNameBreak fixLineHeight">
                                          {item?.column_1}{" "}
                                        </td>
                                        <td className="fixLineHeight">
                                          {item?.column_2}
                                        </td>
                                        <td className="fixLineHeight">
                                          {item?.description}
                                        </td>

                                        <td className="fixLineHeight">
                                          <Image
                                            src={
                                              item?.media
                                                ? process.env
                                                    .NEXT_PUBLIC_SITE_URL +
                                                  item?.media
                                                : "/no-img.jpg"
                                            }
                                            width={80}
                                            height={80}
                                            alt={item?.column_1}
                                          />
                                        </td>
                                        <td className="fixLineHeight">
                                          {parseInt(item?.active)
                                            ? "Yes"
                                            : "No"}
                                        </td>
                                      </>
                                    )}

                                    <td>
                                      <button
                                        className="btn btn-primary mx-1"
                                        onClick={() =>
                                          item?.edit
                                            ? updateMeetExecutive(item?.id)
                                            : editFieldData(
                                                item?.id,
                                                index,
                                                "MeetExecutive"
                                              )
                                        }
                                      >
                                        {item?.edit ? (
                                          <i
                                            className="fa fa-floppy-o"
                                            aria-hidden="true"
                                          />
                                        ) : (
                                          <i
                                            className="fa fa-pencil-square-o"
                                            aria-hidden="true"
                                          />
                                        )}
                                      </button>

                                      <button
                                        className="btn btn-secondary"
                                        onClick={() =>
                                          deleteData(item.id, "MeetExecutive")
                                        }
                                      >
                                        <i
                                          className="fa fa-trash-o"
                                          aria-hidden="true"
                                        />
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })
                            : ""}
                        </tbody>
                      </table>
                    </div>

                    <br />
                    <br />
                    <div className="container">
                      <div className="row">
                        <div className="col-md-6">
                          <label className="form-label-1">Exec Name</label>
                          <input
                            value={exeName}
                            type="text"
                            onChange={(e) => setExeName(e?.target?.value)}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label-1">Exec Title</label>
                          <input
                            value={exeTitle}
                            type="text"
                            onChange={(e) => setExeTitle(e?.target?.value)}
                          />
                        </div>
                      </div>
                      <br />
                      <div className="row">
                        <div className="col-md-3">
                          <label className="form-label-1">Exec. Media</label>
                        </div>

                        <div className="col-md-3">
                          <Image
                            src={
                              exeMediaPreview ? exeMediaPreview : "/no-img.jpg"
                            }
                            width={80}
                            height={80}
                            alt="Picture of the author"
                          />
                        </div>

                        <div className="col-md-3">
                          <input
                            type="file"
                            onChange={(e) => onchangeFile(e, "executive")}
                          />
                          <span className="mbSpan">
                            Max file size for images is 6 MB
                          </span>
                        </div>

                        <div className="col-md-3 ">
                          <div className="active1">
                            <label className="form-check-label">
                              Active &nbsp;
                            </label>
                            <input
                              type="checkbox"
                              checked={exeActive}
                              id="active"
                              onChange={(e) => setExeActive(e?.target?.checked)}
                            />
                          </div>
                        </div>
                      </div>
                      <br /> <br />
                      <div className="col-md-12">
                        <label className="form-label-1" htmlFor="typeText">
                          Exec Description
                        </label>

                        <div className="form-outline">
                          <textarea
                            value={exeDes}
                            className="form-control reduceFont"
                            placeholder="Type here"
                            id="floatingTextarea"
                            onChange={(e) => setExeDes(e?.target?.value)}
                          ></textarea>
                        </div>

                        <br />

                        <div className="col-md-12">
                          <div className="text-right">
                            <button
                              type="button"
                              onClick={(e) => saveMeetExecutive(e)}
                              className="btn btn btn-outline-primary align-bottom updateBtnSize updateBtnSize"
                            >
                              Update Site
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="panel important">
              <h2>
                {" "}
                <i className="fa fa-hand-o-right" aria-hidden="true"></i> Meet
                Our Founder
              </h2>
              <div className="container">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="total" className="form-label-1">
                        Section Title
                      </label>
                      <input
                        type="text"
                        className="form-control reduceFont"
                        name="section_title"
                        value={sectionTitle}
                        onChange={(e) => setSectionTitle(e?.target?.value)}
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="total" className="form-label-1">
                        Section Post
                      </label>

                      <textarea
                        className="form-control reduceFont"
                        placeholder="Type here"
                        name="sectionPost"
                        value={sectionPost}
                        onChange={(e) => setSectionPost(e?.target?.value)}
                      ></textarea>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <label htmlFor="total" className="form-label-1">
                      Section Media
                    </label>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <Image
                        src={
                          sectionMediaPreview
                            ? sectionMediaPreview
                            : pageStaticContent?.section_media
                            ? process.env.NEXT_PUBLIC_SITE_URL +
                              pageStaticContent?.section_media
                            : "/no-img.jpg"
                        }
                        width={80}
                        height={80}
                        alt="Picture of the author"
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => onchangeFile(e, "sectionMedia")}
                      />
                      <span className="mbSpan">
                        Upload image only, Size must be 6MB
                      </span>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <button
                        type="button"
                        className="btn btn btn-outline-primary align-bottom updateBtnSize"
                        style={{ float: "right" }}
                        onClick={addMeetOurFounder}
                      >
                        Update Site
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="panel important">
              <h2>
                <i className="fa fa-hand-o-right" aria-hidden="true"></i>
                Campaign News
              </h2>

              <div className="container">
                <label className="form-label-1" htmlFor="typeText">
                  Campaign News
                </label>
                <div className="row">
                  <div className="col-md-12">
                    <div
                      className="table-container"
                      style={{ overflowX: "auto", maxWidth: "100%" }}
                    >
                      <div className="table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Order</th>
                              <th>Views</th>
                              <th>Title</th>
                              <th>Media Type </th>
                              <th style={{ minWidth: "120px" }}>Expire Date</th>
                              <th>Description</th>
                              <th>Featured</th>
                              <th>Active</th>
                              <th>Manage Comments</th>

                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {newsSectionData?.length
                              ? newsSectionData?.map((item, index) => (
                                  <tr key={index}>
                                    <td
                                      // className={`${
                                      //   item.expire_date < currentDate2
                                      //     ? "ExpireData"
                                      //     : null
                                      // }`}
                                      className={`${
                                        item.active == "0"
                                          ? "ExpireData"
                                          : "ActiveData"
                                      }`}
                                    >
                                      {index + 1}
                                    </td>
                                    {item?.edit ? (
                                      <>
                                        <td></td>
                                        <td>
                                          <input
                                            type="text"
                                            name="title"
                                            value={text1}
                                            onChange={(e) =>
                                              settext1(e?.target?.value)
                                            }
                                          />
                                        </td>
                                        <td>
                                          {toggleNewsYT ? (
                                            <>
                                              <div className="">
                                                {newsupdateYTdata != ""
                                                  ? showVideo(newsupdateYTdata)
                                                  : showVideo("no-video")}
                                              </div>
                                              <div className="">
                                                <input
                                                  className=""
                                                  type="text"
                                                  value={newsupdateYTdata}
                                                  onChange={(e) => {
                                                    const inputValue =
                                                      e.target.value.trim();
                                                    setnewsupdateYTdata(
                                                      inputValue
                                                    );
                                                  }}
                                                />
                                                <span className="mbSpan">
                                                  Add YouTube video link.
                                                </span>
                                              </div>
                                              <div className="">
                                                <span
                                                  className=" custom-youtube-toggleLink"
                                                  onClick={() => {
                                                    toggleNewsYT
                                                      ? settoggleNewsYT(false)
                                                      : (settoggleNewsYT(true),
                                                        settoggleNewsYT(""));
                                                  }}
                                                >
                                                  <BsFileEarmarkImage id="youTubelogo" />
                                                  Custom Video
                                                </span>
                                              </div>
                                            </>
                                          ) : (
                                            <>
                                              <input
                                                type="file"
                                                name="media"
                                                onChange={(e) => {
                                                  const img =
                                                    e?.target?.files[0];

                                                  const fileName =
                                                    img.name.toLowerCase();

                                                  if (
                                                    /\.(tiff|eps|avi|wmv|bmp|flv)$/.test(
                                                      fileName
                                                    )
                                                  ) {
                                                    e.target.value = null;
                                                    showNotification(
                                                      "File format not supported.",
                                                      "Error"
                                                    );
                                                    return;
                                                  }
                                                  if (
                                                    /\.(jpg|jpeg|png|gif|webp|jfif)$/.test(
                                                      fileName
                                                    )
                                                  ) {
                                                    if (
                                                      img.size >
                                                      6 * 1024 * 1024
                                                    ) {
                                                      e.target.value = null;
                                                      showNotification(
                                                        "Image size exceeds 6MB. Please choose a smaller image.",
                                                        "Error"
                                                      );
                                                    } else {
                                                      setupdateFile(
                                                        e.target.files[0]
                                                      );
                                                    }
                                                  } else if (
                                                    /\.(mp4|mov|mkv||Ff4v|swf|webm)$/.test(
                                                      fileName
                                                    )
                                                  ) {
                                                    if (
                                                      img.size >
                                                      100 * 1024 * 1024
                                                    ) {
                                                      e.target.value = null;
                                                      showNotification(
                                                        "Video size exceeds 100MB. Please choose a smaller video.",
                                                        "Error"
                                                      );
                                                    } else {
                                                      setupdateFile(
                                                        e.target.files[0]
                                                      );
                                                    }
                                                  } else if (
                                                    /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt|csv|html|js|jsx|php|tiff)$/.test(
                                                      fileName
                                                    )
                                                  ) {
                                                    e.target.value = null;
                                                    showNotification(
                                                      "Unsupported File type.",
                                                      "Error"
                                                    );
                                                    return;
                                                  }
                                                }}
                                              />
                                              <div
                                                style={{ width: "100%" }}
                                                className=""
                                              >
                                                <span
                                                  className="mx-4 custom-youtube-toggleLink"
                                                  onClick={() => {
                                                    toggleNewsYT
                                                      ? settoggleNewsYT(false)
                                                      : settoggleNewsYT(true);
                                                  }}
                                                >
                                                  <BsYoutube id="youTubelogo" />
                                                  YouTube Link
                                                </span>
                                              </div>
                                            </>
                                          )}
                                        </td>
                                        <td>
                                          <DatePicker
                                            value={updateDate}
                                            minDate={item?.expire_date}
                                            onChange={(date) =>
                                              setupdateDate(
                                                getFormatedDate(
                                                  date,
                                                  "YYYY-MM-DD"
                                                )
                                              )
                                            }
                                            dateFormat="MMMM d, yyyy h:mm aa"
                                          />
                                        </td>
                                        <td>
                                          <textarea
                                            className="form-control "
                                            placeholder="Type here"
                                            id="floatingTextarea"
                                            value={updateCampSection}
                                            onChange={(e) =>
                                              setUpdateCampSection(
                                                e?.target?.value
                                              )
                                            }
                                          ></textarea>
                                        </td>
                                        <td>
                                          <input
                                            type="checkbox"
                                            name="status"
                                            id="active"
                                            checked={featuredActive}
                                            onChange={(e) =>
                                              setFeaturedActive(
                                                e?.target?.checked
                                              )
                                            }
                                          />
                                        </td>
                                        <td>
                                          <input
                                            type="checkbox"
                                            name="status"
                                            id="active"
                                            checked={updateActive}
                                            onChange={(e) =>
                                              setUpdateActive(
                                                e?.target?.checked
                                              )
                                            }
                                          />
                                        </td>
                                      </>
                                    ) : (
                                      <>
                                        <td>{item?.view ? item?.view : 0} </td>
                                        <td>{item?.title}</td>
                                        <td>
                                          {item.media_type == "image" ? (
                                            <Image
                                              src={
                                                item?.media
                                                  ? process.env
                                                      .NEXT_PUBLIC_SITE_URL +
                                                    item?.media
                                                  : "/no-img.jpg"
                                              }
                                              width={80}
                                              height={80}
                                              alt="Picture of the author"
                                            />
                                          ) : item.media_type == "video" ? (
                                            <ReactPlayer
                                              url={
                                                item?.media
                                                  ? process.env
                                                      .NEXT_PUBLIC_SITE_URL +
                                                    item?.media
                                                  : "/no-img.jpg"
                                              }
                                              playing={false}
                                              muted={true}
                                              width={"100px"}
                                              height={"80"}
                                            />
                                          ) : (
                                            <ReactPlayer
                                              url={item?.media}
                                              playing={false}
                                              muted={true}
                                              width={"100px"}
                                              height={"80px"}
                                            />
                                          )}
                                        </td>
                                        <td>
                                          {item?.expire_date &&
                                            getFormatedDate(
                                              item?.expire_date,
                                              "MM/DD/YYYY"
                                            )}
                                        </td>
                                        <td>
                                          <p className="para-width  ">
                                            {item?.news_artical}
                                            {/* {manageReadmore ? (
                                              <>
                                                {item?.news_artical?.slice(
                                                  0,
                                                  100
                                                )}
                                                <button
                                                  class="readMoreBtn"
                                                  onClick={() =>
                                                    setmanageReadmore(false)
                                                  }
                                                >
                                                  Read More
                                                </button>
                                              </>
                                            ) : (
                                              <>
                                                {item?.news_artical}
                                                <button
                                                  class="readMoreBtn"
                                                  onClick={() =>
                                                    setmanageReadmore(true)
                                                  }
                                                >
                                                  Read Less
                                                </button>
                                              </>
                                            )} */}
                                          </p>
                                        </td>
                                        <td>
                                          {parseInt(item?.featuredItem)
                                            ? "Yes"
                                            : "No"}
                                        </td>

                                        <td>
                                          <span className="btn ">
                                            {parseInt(item?.active)
                                              ? "Yes"
                                              : "No"}
                                          </span>{" "}
                                        </td>
                                      </>
                                    )}
                                    <td>
                                      <span>{getCommentCount(item?.id)}</span>
                                      {getCommentCount(item?.id) ? (
                                        <Link
                                          href={`/admin/comments/${item?.title}/${item?.id}`}
                                          target="_blank"
                                        >
                                          <br />{" "}
                                          <span className="manageCommentBTN">
                                            {" "}
                                            View All
                                          </span>
                                        </Link>
                                      ) : (
                                        ""
                                      )}
                                    </td>
                                    <td>
                                      <button
                                        className="btn btn-primary mx-1"
                                        onClick={() =>
                                          item?.edit
                                            ? updateFormData(
                                                item?.id,
                                                "CampNews"
                                              )
                                            : editFieldData(
                                                item?.id,
                                                index,
                                                "CampNews"
                                              )
                                        }
                                      >
                                        {item?.edit ? (
                                          <i
                                            className="fa fa-floppy-o"
                                            aria-hidden="true"
                                          />
                                        ) : (
                                          <i
                                            className="fa fa-pencil-square-o"
                                            aria-hidden="true"
                                          />
                                        )}
                                      </button>

                                      <button
                                        className="btn btn-secondary"
                                        onClick={() =>
                                          deleteData(item?.id, "CampaignNews")
                                        }
                                      >
                                        <i
                                          className="fa fa-trash-o"
                                          aria-hidden="true"
                                        />
                                      </button>
                                    </td>
                                  </tr>
                                ))
                              : null}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="container">
                      <div className="row">
                        <div className="col-md-12">
                          <label className="form-label-1">News Title</label>
                          <input
                            value={campTitle}
                            type="text"
                            onChange={(e) => setCampTitle(e?.target?.value)}
                          />
                          <label className="form-label-1">News Media</label>
                        </div>
                        {toggleNewsYoutube ? (
                          <>
                            <div className="container">
                              <div className="row">
                                <div className="col-md-3">
                                  <label
                                    className="form-label"
                                    htmlFor="typeText"
                                  >
                                    Youtube Media
                                  </label>
                                </div>
                                <div className="col-md-3">
                                  {youtubeLinkCampHeaderNews != ""
                                    ? showVideo(youtubeLinkCampHeaderNews)
                                    : showVideo("no-video")}
                                </div>
                                <div className="col-md-3">
                                  <input
                                    className="form-control"
                                    type="text"
                                    value={youtubeLinkCampHeaderNews}
                                    onChange={(e) => {
                                      const inputValue = e.target.value.trim();
                                      setyoutubeLinkCampHeaderNews(inputValue);
                                    }}
                                  />
                                  <span className="mbSpan">
                                    Add YouTube video link.
                                  </span>
                                </div>

                                {/* <div className="col-md-3">
                                  <button
                                    type="button"
                                    className="btn btn-outline-primary updateBtnSize"
                                    onClick={(e) => updateCampNews(e)}
                                  >
                                    Update Site
                                  </button>
                                </div> */}
                              </div>

                              <div className="text-center youTubeOption2">
                                <span
                                  className="mx-4 custom-youtube-toggleLink"
                                  onClick={() => {
                                    toggleNewsYoutube
                                      ? setToggleNewsYoutube(false)
                                      : (setToggleNewsYoutube(true),
                                        setyoutubeLinkCampHeaderNews(""));
                                  }}
                                >
                                  <BsFileEarmarkImage id="youTubelogo" />
                                  Custom Video
                                </span>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="col-md-3">
                              <div className="form-group">
                                {campMediaPreview?.filetype == "video" ? (
                                  <ReactPlayer
                                    url={
                                      campMediaPreview?.src
                                        ? campMediaPreview?.src
                                        : "demo-video.mp4"
                                    }
                                    controls
                                    playing={false}
                                    muted={true}
                                    width={"50%"}
                                    height={80}
                                  />
                                ) : (
                                  <Image
                                    src={
                                      campMediaPreview?.src
                                        ? campMediaPreview?.src
                                        : "/no-img.jpg"
                                    }
                                    width={80}
                                    height={80}
                                    alt="Picture of the author"
                                  />
                                )}
                              </div>
                            </div>
                            <div className="col-md-3">
                              <label className="form-label-1">
                                {" "}
                                Upload Image{" "}
                              </label>
                              <div className="form-group">
                                <input
                                  type="file"
                                  onChange={(e) => onchangeFile(e, "campaign")}
                                />
                                <span className="mbSpan">
                                  Upload image or video only, Size must be less
                                  than 6MB or 100MB
                                </span>
                              </div>
                              <div
                                style={{ width: "100%" }}
                                className="d-flex justify-content-center align-items-center youTubeOption2"
                              >
                                <span
                                  className="mx-4 custom-youtube-toggleLink"
                                  onClick={() => {
                                    toggleNewsYoutube
                                      ? setToggleNewsYoutube(false)
                                      : setToggleNewsYoutube(true);
                                  }}
                                >
                                  <BsYoutube id="youTubelogo" />
                                  YouTube Link
                                </span>
                              </div>
                            </div>
                          </>
                        )}
                        <div className="col-md-2">
                          <label className="form-label-1"> Expire Date </label>
                          <div className="form-group_1">
                            <DatePicker
                              value={campDate}
                              minDate={new Date()}
                              onChange={(date) => setDateFormate(date)}
                              dateFormat="MMMM d, yyyy h:mm aa"
                            />
                          </div>
                        </div>
                        <div className="col-md-2">
                          <label className="form-label-1">
                            Featured Item &nbsp;
                          </label>
                          <input
                            type="checkbox"
                            id="flexCheckDefault"
                            checked={campItem}
                            onChange={(e) => setCampItem(e?.target?.checked)}
                          />
                        </div>
                        <div className="col-md-2">
                          <label className="form-label-1">Active &nbsp;</label>
                          <input
                            type="checkbox"
                            id="flexCheckDefault"
                            checked={campActive}
                            onChange={(e) => setCampActive(e?.target?.checked)}
                          />
                        </div>
                        <br /> <br />
                        <div className="container">
                          <div className="row">
                            <div className="col-md-12">
                              <label
                                className="form-label-1"
                                htmlFor="typeText"
                              >
                                {" "}
                                News Article{" "}
                              </label>
                              <div className="form-outline">
                                <textarea
                                  className="form-control reduceFont"
                                  placeholder="Type here"
                                  id="floatingTextarea"
                                  onChange={(e) =>
                                    setCampSection(e?.target?.value)
                                  }
                                  value={campSection}
                                ></textarea>
                              </div>

                              <br />

                              <div className="text-right">
                                <button
                                  type="button"
                                  className="btn btn btn-outline-primary align-bottom updateBtnSize"
                                  onClick={(e) => updateCampNews(e)}
                                >
                                  Update Site
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="panel important">
              <h2>
                {" "}
                <i className="fa fa-hand-o-right" aria-hidden="true"></i>{" "}
                Putting Chicago to Work
              </h2>

              <div className="container">
                <div className="row">
                  <div className="col-md-6">
                    <label className="form-label-1">Latest Issue Link</label>
                    <input
                      type="text"
                      accept="latestIssueLink/*"
                      name="latestIssueLink"
                      value={latestIssueLink}
                      onChange={(e) => setlatestIssueLink(e?.target?.value)}
                    />

                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => updateStaticContent("latestIssueLink")}
                        className="btn btn btn-outline-primary align-bottom updateBtnSize"
                      >
                        Update Site
                      </button>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label-1">Job Post Link</label>
                    <input
                      type="text"
                      accept="jobPostLink/*"
                      name="jobPostLink"
                      value={jobPostLink}
                      onChange={(e) => setjobPostLink(e?.target?.value)}
                    />

                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => updateStaticContent("jobPostLink")}
                        className="btn btn btn-outline-primary align-bottom updateBtnSize"
                      >
                        Update Site
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="panel important">
              <h2>
                {" "}
                <i className="fa fa-hand-o-right" aria-hidden="true"></i>
                Sponsors & Partners
              </h2>

              <div className="container">
                <label className="form-label-1" htmlFor="typeText">
                  Executive List
                </label>
                <div className="row">
                  <div className="col-md-12">
                    <div className="table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Order</th>
                            <th>Company</th>

                            <th>Upload Date </th>
                            <th>Active</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sponsorPartnerData?.length
                            ? sponsorPartnerData?.map((item, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>

                                  {item?.edit ? (
                                    <>
                                      <td>
                                        <input
                                          type="text"
                                          name="title"
                                          value={editSponTitle}
                                          onChange={(e) =>
                                            setEditSponTitle(e?.target?.value)
                                          }
                                        />
                                      </td>

                                      <td>
                                        <Image
                                          src={
                                            editSponMediaPreview
                                              ? editSponMediaPreview
                                              : "/no-img.jpg"
                                          }
                                          width={80}
                                          height={80}
                                        />
                                        <input
                                          type="file"
                                          onChange={(e) =>
                                            onchangeFile(e, "sponsorUpdate")
                                          }
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type="checkbox"
                                          name="status"
                                          id="active"
                                          checked={editSponActive}
                                          onChange={(e) =>
                                            setEditSponActive(
                                              e?.target?.checked
                                            )
                                          }
                                        />
                                      </td>
                                    </>
                                  ) : (
                                    <>
                                      {" "}
                                      <td>{item?.title}</td>
                                      <td>
                                        {getFormatedDate(
                                          item?.updated_at,
                                          "MM/DD/YYYY"
                                        )}
                                      </td>
                                      <td>
                                        {parseInt(item?.active) ? "Yes" : "No"}
                                      </td>
                                    </>
                                  )}
                                  <td>
                                    <button
                                      className="btn btn-primary mx-1"
                                      onClick={() =>
                                        item?.edit
                                          ? updateFormData(
                                              item?.id,
                                              "SponsorPartner"
                                            )
                                          : editFieldData(
                                              item?.id,
                                              index,
                                              "SponsorPartner"
                                            )
                                      }
                                    >
                                      {item?.edit ? (
                                        <i
                                          className="fa fa-floppy-o"
                                          aria-hidden="true"
                                        />
                                      ) : (
                                        <i
                                          className="fa fa-pencil-square-o"
                                          aria-hidden="true"
                                        />
                                      )}
                                    </button>

                                    <button
                                      className="btn btn-secondary"
                                      onClick={() =>
                                        deleteData(item.id, "ExecutiveList")
                                      }
                                    >
                                      <i
                                        className="fa fa-trash-o"
                                        aria-hidden="true"
                                      />
                                    </button>
                                  </td>
                                </tr>
                              ))
                            : null}
                        </tbody>
                      </table>
                    </div>

                    <br />
                    <br />

                    <div className="container">
                      <div className="row">
                        <div className="col-md-5">
                          <label className="form-label-1">Company Name</label>
                          <input
                            value={sponTitle}
                            type="text"
                            onChange={(e) => setSponTitle(e?.target?.value)}
                          />
                        </div>

                        <div className="col-md-2">
                          <label className="form-label-1">View Media</label>
                          <Image
                            src={
                              sponMediaPreview
                                ? sponMediaPreview
                                : "/no-img.jpg"
                            }
                            width={80}
                            height={80}
                            alt="Picture of the author"
                          />
                        </div>

                        <div className="col-md-3">
                          <label className="form-label-1"> Upload Image </label>
                          <div className="form-group">
                            <input
                              type="file"
                              onChange={(e) => onchangeFile(e, "sponsor")}
                            />
                            <span className="mbSpan">
                              Upload image only, Size must be less than 6MB
                            </span>
                          </div>
                        </div>

                        <div className="col-md-2">
                          <label className="form-label-1">Active &nbsp;</label>
                          <br />
                          <input
                            type="checkbox"
                            checked={sponActive}
                            id="flexCheckDefault"
                            onChange={(e) => setSponActive(e?.target?.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <button
                        type="button"
                        className="btn btn btn-outline-primary align-bottom updateBtnSize"
                        onClick={(e) => updateSponPartner(e)}
                      >
                        Update Site
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        </main>
      </AdminLayout>
    </>
  );
};

function showVideo(fileSrc) {
  return (
    <>
      {fileSrc == "no-video" ? (
        <Image src="/no-img.jpg" width={80} height={80} alt="video-banner" />
      ) : (
        <ReactPlayer
          url={fileSrc}
          playing={false}
          muted={true}
          width={"50%"}
          height={80}
        />
      )}
    </>
  );
}

function showImage(fileSrc) {
  return <Image src={fileSrc} width={80} height={80} alt="video-banner" />;
}
function showYoutube(fileSrc) {
  return (
    <ReactPlayer
      url={fileSrc}
      playing={false}
      muted={true}
      width={"50%"}
      height={80}
    />
  );
}

export default Home;
