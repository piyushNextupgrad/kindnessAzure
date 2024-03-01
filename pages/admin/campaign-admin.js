import Image from "next/image";
import { useDebugValue, useEffect, useState } from "react";
import {
  checkImageOrVideoFromUrl,
  extractRecordFromObject,
} from "@/store/library/utils";
import { campaignServices } from "@/store/services/campaignPageServices";
import { homePageService } from "@/store/services";
import showNotification from "@/helpers/show_notification";
import { getFormatedDate, getBase64 } from "@/store/library/utils";
import ReactPlayer from "react-player";
import AdminLayout from "@/layout/adminLayout";
import { Spinner } from "react-bootstrap";
import { BsYoutube, BsFileEarmarkImage } from "react-icons/bs";

const Compaign_page = () => {
  const [eqtDes, setEqtDes] = useState();
  const [eqtMedia, setEqtMedia] = useState("");
  const [eduMedia, setEduMedia] = useState("");
  const [eduDes, setEduDes] = useState("");
  const [wDes, setWDes] = useState();
  const [wMedia, setWMedia] = useState("");
  const [pMedia, setPMedia] = useState("");
  const [pDes, setPDes] = useState();
  const [hPost, setHPost] = useState();
  const [hMedia, setHMedia] = useState("");
  const [hTitle, setHTitle] = useState();
  const [adminMedia1, setadminMedia1] = useState("");
  const [adminMedia2, setadminMedia2] = useState([]);
  const [heathEquityData, setHeathEquityData] = useState([]);
  const [workforceEquityData, setWorkforceEquityData] = useState([]);
  const [publicEquityData, setPublicEquityData] = useState([]);
  const [educationEquityData, setEducationEquityData] = useState([]);

  const [pageStaticContent, setPageStaticContent] = useState();
  //states for update API health Equity - piyush
  const [text1, settext1] = useState();
  const [isSubmittingLoader, setIsSubmittingLoader] = useState(false);

  const [updateActive, setUpdateActive] = useState(0);
  const [upMedia, setupMedia] = useState();
  const [upMediaPreview, setupMediaPreview] = useState();

  //states for update API workforce Equity - piyush
  const [text2, settext2] = useState();
  const [updateActive2, setUpdateActive2] = useState(0);
  const [upMedia2, setupMedia2] = useState();
  const [upMediaPreview2, setupMediaPreview2] = useState();
  //states for update API education Equity - piyush
  const [text3, settext3] = useState();
  const [updateActive3, setUpdateActive3] = useState(0);
  const [upMedia3, setupMedia3] = useState();
  const [upMediaPreview3, setupMediaPreview3] = useState();
  //states for update API public Equity - piyush
  const [text4, settext4] = useState();
  const [updateActive4, setUpdateActive4] = useState(0);
  const [upMedia4, setupMedia4] = useState();
  const [upMediaPreview4, setupMediaPreview4] = useState();
  const [ToggleYoutube, setToggleYoutube] = useState(true);
  const [youtubeLinkCampHeader, setyoutubeLinkCampHeader] = useState("");

  const [preview, setpreview] = useState("");
  const [preview2, setpreview2] = useState("");
  const [preview3, setpreview3] = useState("");
  const [preview4, setpreview4] = useState("");
  const [toggleHealthYoutube, setToggleHalthYoutube] = useState(false);
  const [toggleEducationYoutube, setToggleEducationYoutube] = useState(false);
  const [toggleWorkforceYoutube, setToggleWorkforceYoutube] = useState(false);
  const [togglePublicYoutube, setTogglePublicYoutube] = useState(false);
  const [youtubeLinkValueHealth, setyoutubeLinkValueHealth] = useState("");
  const [youtubeLinkValuePublic, setyoutubeLinkValuePublic] = useState("");
  const [youtubeLinkValueWorkforce, setyoutubeLinkValueWorkforce] =
    useState("");
  const [youtubeLinkValueEducation, setyoutubeLinkValueEducation] =
    useState("");
  const [toggleNewsYT, settoggleNewsYT] = useState(false);
  const [toggleEduYT, settoggleEduYT] = useState(false);
  const [toggleWorkYT, settoggleWorkYT] = useState(false);
  const [togglePublicYT, settogglePublicYT] = useState(false);
  const [newsupdateYTdata, setnewsupdateYTdata] = useState("");
  const [updateYTdataEdu, setupdateYTdataEdu] = useState("");
  const [updateYTdataPublic, setupdateYTdataPublic] = useState("");
  const [updateYTdataWork, setupdateYTdataWork] = useState("");
  //function to update data - piyush

  function editFieldData(id, index, sectionName) {
    if (sectionName == "healthEquity") {
      let obj = heathEquityData?.find(
        (newRowListItem) => newRowListItem?.edit === true
      );
      if (obj?.id == undefined) {
        let data = heathEquityData[index];
        data.edit = true;

        heathEquityData[index] = data;
        setHeathEquityData([...heathEquityData]);

        settext1(data?.description);
        setupMediaPreview(process.env.NEXT_PUBLIC_SITE_URL + data?.media);
      } else {
        showNotification("Please Save Last edited field", "Error");
      }
    }

    if (sectionName == "WorkforceEquity") {
      let obj = workforceEquityData?.find(
        (newRowListItem) => newRowListItem?.edit === true
      );
      if (obj?.id == undefined) {
        let data = workforceEquityData[index];
        data.edit = true;

        workforceEquityData[index] = data;
        setWorkforceEquityData([...workforceEquityData]);

        settext2(data?.description);
      } else {
        showNotification("Please Save Last edited field", "Error");
      }
    }

    if (sectionName == "EducationEquity") {
      let obj = educationEquityData?.find(
        (newRowListItem) => newRowListItem?.edit === true
      );
      if (obj?.id == undefined) {
        let data = educationEquityData[index];
        data.edit = true;

        educationEquityData[index] = data;
        setEducationEquityData([...educationEquityData]);

        settext3(data?.description);
      } else {
        showNotification("Please Save Last edited field", "Error");
      }
    }
    if (sectionName == "PublicEquity") {
      let obj = publicEquityData?.find(
        (newRowListItem) => newRowListItem?.edit === true
      );
      if (obj?.id == undefined) {
        let data = publicEquityData[index];
        data.edit = true;

        publicEquityData[index] = data;
        setPublicEquityData([...publicEquityData]);

        settext4(data?.description);
      } else {
        showNotification("Please Save Last edited field", "Error");
      }
    }
  }

  const updateFormData = async (id, sectionName) => {
    try {
      setIsSubmittingLoader(true);
      if (sectionName == "healthEquity") {
        try {
          const formData = new FormData();
          formData.append("updateId", id);

          if (text1) {
            formData.append("imgDesc", text1);
          }

          if (toggleNewsYT) {
            formData.append("newsMedia", newsupdateYTdata);
          } else {
            if (upMedia && typeof upMedia == "object") {
              formData.append("newsMedia", upMedia);
            }
          }

          formData.append("secName", "health_equity");
          const response = await campaignServices.addEquitySectionContent(
            formData
          );

          if (response?.data) {
            showNotification(response.data.message, "Success");
            setIsSubmittingLoader(false);
            getEquitySectionData();
            setupMedia("");
            settext1("");
            setnewsupdateYTdata("");
          } else {
            setIsSubmittingLoader(false);
            showNotification(response.data.message, "Error");
          }
        } catch (error) {
          setIsSubmittingLoader(false);
          console.error(error);
        }
      } else if (sectionName == "WorkforceEquity") {
        try {
          setIsSubmittingLoader(true);
          const formData = new FormData();
          formData.append("updateId", id);
          formData.append("imgDesc", text2);
          if (toggleWorkYT) {
            formData.append("newsMedia", updateYTdataWork);
          } else {
            if (upMedia2 && typeof upMedia2 == "object") {
              formData.append("newsMedia", upMedia2);
            }
          }
          formData.append("secName", "workforce_equity");

          const response = await campaignServices.addEquitySectionContent(
            formData
          );

          if (response?.data) {
            setIsSubmittingLoader(false);
            showNotification(response.data.message, "Success");
            getEquitySectionData();
            settext2("");
            setupMedia2("");
            setnewsupdateYTdata("");
          } else {
            setIsSubmittingLoader(false);
            showNotification(response.data.message, "Error");
          }
        } catch (error) {
          setIsSubmittingLoader(false);
          console.error(error);
        }
      } else if (sectionName == "EducationEquity") {
        try {
          setIsSubmittingLoader(true);
          const formData = new FormData();
          formData.append("updateId", id);
          formData.append("imgDesc", text3);
          if (toggleEduYT) {
            formData.append("newsMedia", updateYTdataEdu);
          } else {
            if (upMedia3 && typeof upMedia3 == "object") {
              formData.append("newsMedia", upMedia3);
            }
          }

          formData.append("secName", "education_equity");

          const response = await campaignServices.addEquitySectionContent(
            formData
          );

          if (response?.data) {
            setIsSubmittingLoader(false);
            showNotification(response.data.message, "Success");
            getEquitySectionData();
            settext3("");
            setupMedia3("");
            setnewsupdateYTdata("");
          } else {
            setIsSubmittingLoader(false);
            showNotification(response.data.message, "Error");
          }
        } catch (error) {
          setIsSubmittingLoader(false);
          console.log(error);
        }
      } else if (sectionName == "PublicEquity") {
        try {
          setIsSubmittingLoader(true);
          const formData = new FormData();
          formData.append("updateId", id);
          formData.append("imgDesc", text4);
          if (togglePublicYT) {
            formData.append("newsMedia", updateYTdataPublic);
          } else {
            if (upMedia4 && typeof upMedia4 == "object") {
              formData.append("newsMedia", upMedia4);
            }
          }

          formData.append("secName", "public_equity");

          const response = await campaignServices.addEquitySectionContent(
            formData
          );

          if (response?.data) {
            setIsSubmittingLoader(false);
            showNotification(response.data.message, "Success");
            getEquitySectionData();
            settext4("");
            setupMedia4("");
            setnewsupdateYTdata("");
          } else {
            setIsSubmittingLoader(false);
            showNotification(response.data.message, "Error");
          }
        } catch (error) {
          setIsSubmittingLoader(false);
          console.error(error);
        }
      }
    } catch (error) {
      setIsSubmittingLoader(false);
      console.error(error);
    }
  };

  const onchangeFile = async (e, fieldOrSectionName) => {
    if (e.target.files && e.target.files[0]) {
      const img = e?.target?.files[0];

      const fileName = img.name.toLowerCase();

      if (/\.(tiff|eps|avi|wmv|bmp|flv)$/.test(fileName)) {
        e.target.value = null;
        showNotification("File format not supported.", "Error");
        return;
      }
      // Check if the file has an image extension
      if (/\.(jpg|jpeg|png|gif|webp|jfif)$/.test(fileName)) {
        if (img.size > 6 * 1024 * 1024) {
          e.target.value = null;
          showNotification(
            "Image size exceeds 6MB. Please choose a smaller image.",
            "Error"
          );
          return;
        }
      }
      if (/\.(mp4|mov|mkv|Ff4v|swf)$/.test(fileName)) {
        if (img.size > 100 * 1024 * 1024) {
          e.target.value = null;
          showNotification(
            "Video size exceeds 100MB. Please choose a smaller video.",
            "Error"
          );
          return;
        }
      }

      let fileData = await getBase64(img);
      if (fieldOrSectionName == "healthEquity") {
        setupMedia(img);
        setupMediaPreview(fileData);
      }
      if (fieldOrSectionName == "WorkforceEquity") {
        setupMedia2(img);
        setupMediaPreview2(fileData);
      }
      if (fieldOrSectionName == "educationEquity") {
        setupMedia3(img);
        setupMediaPreview3(fileData);
      }
      if (fieldOrSectionName == "PublicEquity") {
        setupMedia4(img);
        setupMediaPreview4(fileData);
      }
    }
  };

  //function to delete the table data - piyush
  async function deleteData(data, sectionName) {
    if (sectionName == "HealthEquity") {
      try {
        setIsSubmittingLoader(true);

        const params = { delId: data };
        const delResp = await campaignServices.addEquitySectionContent(params);

        const newHeathEquityData = heathEquityData.filter(
          (item) => item.id != data
        );
        setHeathEquityData(newHeathEquityData);
        setIsSubmittingLoader(false);
        showNotification("Item deleted", "Success");
      } catch (error) {
        setIsSubmittingLoader(false);
        console.log(error);
      }
    }
    if (sectionName == "EducationEquity") {
      try {
        setIsSubmittingLoader(true);
        const params = { delId: data };
        const delResp = await campaignServices.addEquitySectionContent(params);

        const newEducationEquityData = educationEquityData.filter(
          (item) => item.id != data
        );
        setEducationEquityData(newEducationEquityData);
        showNotification("Item deleted", "Success");
        setIsSubmittingLoader(false);
      } catch (error) {
        setIsSubmittingLoader(false);
        console.log(error);
      }
    }
    if (sectionName == "WorkforceEquity") {
      try {
        setIsSubmittingLoader(true);
        const params = { delId: data };
        const delResp = await campaignServices.addEquitySectionContent(params);

        const newWorkforceEquityData = workforceEquityData.filter(
          (item) => item.id != data
        );
        setWorkforceEquityData(newWorkforceEquityData);
        setIsSubmittingLoader(false);
        showNotification("Item deleted", "Success");
      } catch (error) {
        setIsSubmittingLoader(false);
        console.log(error);
      }
    }
    if (sectionName == "PublicEquity") {
      try {
        setIsSubmittingLoader(true);
        const params = { delId: data };
        const delResp = await campaignServices.addEquitySectionContent(params);

        const newPublicEquityData = publicEquityData.filter(
          (item) => item.id != data
        );
        setPublicEquityData(newPublicEquityData);
        setIsSubmittingLoader(false);
        showNotification("Item deleted", "Success");
      } catch (error) {
        setIsSubmittingLoader(false);
        console.log(error);
      }
    }
  }

  function convertObjectToArray(objectData) {
    var data = Object.keys(objectData).map(function (key) {
      return objectData[key];
    });
    return data;
  }

  const getEquitySectionData = async () => {
    try {
      let params = {};
      const resp4 = await campaignServices.getLoopData(params);

      if (resp4?.data?.success) {
        const respData = resp4?.data?.data?.reverse();

        let health = extractRecordFromObject(
          respData?.filter((item) => item?.sec_name == "health_equity"),
          0,
          5
        );
        let education = extractRecordFromObject(
          respData?.filter((item) => item?.sec_name == "education_equity"),
          0,
          5
        );
        let publicEq = extractRecordFromObject(
          respData?.filter((item) => item?.sec_name == "public_equity"),
          0,
          5
        );
        let workforce = extractRecordFromObject(
          respData?.filter((item) => item?.sec_name == "workforce_equity"),
          0,
          5
        );
        console.log("Health", convertObjectToArray(health));

        setHeathEquityData(convertObjectToArray(health));
        setWorkforceEquityData(convertObjectToArray(workforce));
        setPublicEquityData(convertObjectToArray(publicEq));
        setEducationEquityData(convertObjectToArray(education));
      } else {
      }

      // setdata3(resp4?.data?.reverse());
    } catch (err) {
      // Handle any other errors that may occur during the request
      console.log(err);
    }
  };

  const updateEqt = async (e) => {
    if (eqtDes != "") {
      if (toggleHealthYoutube) {
        try {
          setIsSubmittingLoader(true);
          const formData = new FormData();
          formData.append("imgDesc", eqtDes);
          formData.append("newsMedia", youtubeLinkValueHealth);
          formData.append("secName", "health_equity");
          const response = await campaignServices.addEquitySectionContent(
            formData
          );

          if (response?.data) {
            getEquitySectionData();
            setIsSubmittingLoader(false);
            showNotification(response.data.message, "Success");
            setEqtDes("");
            setEqtMedia("");
            setpreview("");
          } else {
            setIsSubmittingLoader(false);
            showNotification(response.data.message, "Error");
            setEqtDes("");
            setEqtMedia("");
            setpreview("");
          }
        } catch (error) {
          setIsSubmittingLoader(false);
          console.error(error);
          setEqtDes("");
          setEqtMedia("");
          setpreview("");
        }
      } else {
        if (eqtMedia != "") {
          try {
            setIsSubmittingLoader(true);
            const formData = new FormData();
            formData.append("imgDesc", eqtDes);
            formData.append("newsMedia", eqtMedia);
            formData.append("secName", "health_equity");
            const response = await campaignServices.addEquitySectionContent(
              formData
            );

            if (response?.data) {
              getEquitySectionData();
              setIsSubmittingLoader(false);
              showNotification(response.data.message, "Success");
              setEqtDes("");
              setEqtMedia("");
              setpreview("");
            } else {
              setIsSubmittingLoader(false);
              showNotification(response.data.message, "Error");
              setEqtDes("");
              setEqtMedia("");
              setpreview("");
            }
          } catch (error) {
            setIsSubmittingLoader(false);
            console.error(error);
            setEqtDes("");
            setEqtMedia("");
            setpreview("");
          }
        } else {
          showNotification("Media is necessary", "Error");
        }
      }
    } else {
      showNotification("Please fill all the fields", "Error");
    }
  };
  const updateEdu = async (e) => {
    if (eduDes != "") {
      if (toggleEducationYoutube) {
        try {
          setIsSubmittingLoader(true);
          const formData = new FormData();
          formData.append("imgDesc", eduDes);
          formData.append("newsMedia", youtubeLinkValueEducation);
          formData.append("secName", "education_equity");

          const response = await campaignServices.addEquitySectionContent(
            formData
          );

          if (response?.data) {
            getEquitySectionData();
            setIsSubmittingLoader(false);
            showNotification(response.data.message, "Success");
            setEduDes("");
            setEduMedia("");
            setpreview("");
            setpreview2("");
            setpreview3("");
            setpreview4("");
          } else {
            setIsSubmittingLoader(false);
            showNotification(response.data.message, "Error");
            setEduDes("");
            setEduMedia("");
            setpreview("");
            setpreview2("");
            setpreview3("");
            setpreview4("");
          }
        } catch (error) {
          setEduDes("");
          setEduMedia("");
          setpreview("");
          setpreview2("");
          setpreview3("");
          setpreview4("");
          setIsSubmittingLoader(false);
          console.error(error);
        }
      } else {
        if (eduMedia != "") {
          try {
            setIsSubmittingLoader(true);
            const formData = new FormData();
            formData.append("imgDesc", eduDes);
            formData.append("newsMedia", eduMedia);
            formData.append("secName", "education_equity");

            const response = await campaignServices.addEquitySectionContent(
              formData
            );

            if (response?.data) {
              getEquitySectionData();
              setIsSubmittingLoader(false);
              showNotification(response.data.message, "Success");
              setEduDes("");
              setEduMedia("");
              setpreview("");
              setpreview2("");
              setpreview3("");
              setpreview4("");
            } else {
              setIsSubmittingLoader(false);
              showNotification(response.data.message, "Error");
              setEduDes("");
              setEduMedia("");
              setpreview("");
              setpreview2("");
              setpreview3("");
              setpreview4("");
            }
          } catch (error) {
            setEduDes("");
            setEduMedia("");
            setpreview("");
            setpreview2("");
            setpreview3("");
            setpreview4("");
            setIsSubmittingLoader(false);
            console.error(error);
          }
        } else {
          showNotification("Media is compulsory", "Error");
        }
      }
    } else {
      showNotification("Please fill all the fields", "Error");
    }
  };
  const updateWork = async (e) => {
    if (wDes != "") {
      if (toggleWorkforceYoutube) {
        try {
          setIsSubmittingLoader(true);
          const formData = new FormData();
          formData.append("imgDesc", wDes);
          formData.append("newsMedia", youtubeLinkValueWorkforce);
          formData.append("secName", "workforce_equity");

          const response = await campaignServices.addEquitySectionContent(
            formData
          );

          if (response?.data) {
            setIsSubmittingLoader(false);
            getEquitySectionData();
            showNotification(response.data.message, "Success");
            setWDes("");
            setWMedia("");
            setpreview("");
            setpreview2("");
            setpreview3("");
            setpreview4("");
          } else {
            setIsSubmittingLoader(false);
            showNotification(response.data.message, "Error");
            setWDes("");
            setWMedia("");
            setpreview("");
            setpreview2("");
            setpreview3("");
            setpreview4("");
          }
        } catch (error) {
          setIsSubmittingLoader(false);
          console.error(error);
          setWDes("");
          setWMedia("");
          setpreview("");
          setpreview2("");
          setpreview3("");
          setpreview4("");
        }
      } else {
        if (wMedia != "") {
          try {
            setIsSubmittingLoader(true);
            const formData = new FormData();
            formData.append("imgDesc", wDes);
            formData.append("newsMedia", wMedia);
            formData.append("secName", "workforce_equity");

            const response = await campaignServices.addEquitySectionContent(
              formData
            );

            if (response?.data) {
              getEquitySectionData();
              setIsSubmittingLoader(false);
              showNotification(response.data.message, "Success");
              setWDes("");
              setWMedia("");
              setpreview("");
              setpreview2("");
              setpreview3("");
              setpreview4("");
            } else {
              setIsSubmittingLoader(false);
              showNotification(response.data.message, "Error");
              setWDes("");
              setWMedia("");
              setpreview("");
              setpreview2("");
              setpreview3("");
              setpreview4("");
            }
          } catch (error) {
            setIsSubmittingLoader(false);
            console.error(error);
            setWDes("");
            setWMedia("");
            setpreview("");
            setpreview2("");
            setpreview3("");
            setpreview4("");
          }
        } else {
          showNotification("Media is compulsory", "Error");
        }
      }
    } else {
      showNotification("Please fill all the fields", "Error");
    }
  };
  const updatePublic = async (e) => {
    if (pDes != "") {
      if (togglePublicYoutube) {
        try {
          setIsSubmittingLoader(true);
          const formData = new FormData();
          formData.append("imgDesc", pDes);
          formData.append("newsMedia", youtubeLinkValuePublic);
          formData.append("secName", "public_equity");

          const response = await campaignServices.addEquitySectionContent(
            formData
          );

          if (response?.data) {
            getEquitySectionData();
            setIsSubmittingLoader(false);
            showNotification(response?.data?.message, "Success");
            setPDes("");
            setPMedia("");
            setpreview2("");
            setpreview2("");
            setpreview3("");
            setpreview4("");
          } else {
            setIsSubmittingLoader(false);
            showNotification(response.data.message, "Error");
            setPDes("");
            setPMedia("");
            setpreview("");
            setpreview2("");
            setpreview3("");
            setpreview4("");
          }
        } catch (error) {
          setIsSubmittingLoader(false);
          console.error(error);
          setPDes("");
          setPMedia("");
          setpreview("");
          setpreview2("");
          setpreview3("");
          setpreview4("");
        }
      } else {
        if (pMedia != "") {
          try {
            getEquitySectionData();
            setIsSubmittingLoader(true);
            const formData = new FormData();
            formData.append("imgDesc", pDes);
            formData.append("newsMedia", pMedia);
            formData.append("secName", "public_equity");

            const response = await campaignServices.addEquitySectionContent(
              formData
            );

            if (response?.data) {
              setIsSubmittingLoader(false);
              showNotification(response?.data?.message, "Success");
              setPDes("");
              setPMedia("");
              setpreview2("");
              setpreview2("");
              setpreview3("");
              setpreview4("");
            } else {
              setIsSubmittingLoader(false);
              showNotification(response.data.message, "Error");
              setPDes("");
              setPMedia("");
              setpreview("");
              setpreview2("");
              setpreview3("");
              setpreview4("");
            }
          } catch (error) {
            setIsSubmittingLoader(false);
            console.error(error);
            setPDes("");
            setPMedia("");
            setpreview("");
            setpreview2("");
            setpreview3("");
            setpreview4("");
          }
        } else {
          showNotification("Media is cumpolsory", "Error");
        }
      }
    } else {
      showNotification("Please fill all the fields", "Error");
    }
  };

  const adminMedia = async () => {
    try {
      const resp = await campaignServices.adminMedia();

      let respDT = resp?.data?.data[5];

      if (respDT?.section_media) {
        respDT.section_media_type = checkImageOrVideoFromUrl(
          respDT?.section_media
        );
      }
      // console.log("campHeader", respDT);
      setadminMedia1(respDT);
    } catch (err) {
      // Handle any other errors that may occur during the request
      console.log(err);
    }
  };
  const fetchadminMedia2 = async () => {
    try {
      let params = {};
      const resp2 = await campaignServices.getLoopData(params);

      setadminMedia2(resp2?.data?.data);
    } catch (err) {
      // Handle any other errors that may occur during the request
      console.log(err);
    }
  };

  useEffect(() => {
    adminMedia();
    fetchadminMedia2();
    campaignPageStaticContent();
    getEquitySectionData();
  }, []);

  const campaignPageStaticContent = async () => {
    try {
      let params = {};
      params.pageName = "campaign";

      const resp = await homePageService?.pageStaticData(params);

      if (resp?.data?.success) {
        let response = resp?.data?.data[0];
        setPageStaticContent(response);
        setHTitle(response?.header_text);
        setHPost(response?.section_post);
      } else {
        setPageStaticContent();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const updatePageHeader = async () => {
    if (youtubeLinkCampHeader == "" && ToggleYoutube == true) {
      try {
        setIsSubmittingLoader(true);
        var form_data = new FormData();
        form_data.append("pageName", "campaign");

        if (hTitle) {
          form_data.append("headerText", hTitle);
        }

        if (hPost) {
          form_data.append("section_post", hPost);
        }

        if (hMedia) {
          form_data.append("section_media", hMedia);
        }

        const resp = await homePageService.addPageStaticContent(form_data);

        if (resp?.data?.success) {
          adminMedia();
          showNotification(resp?.data?.message, "Success");

          setIsSubmittingLoader(false);
        } else {
          setIsSubmittingLoader(false);

          showNotification(resp?.data?.message, "Error");
        }
      } catch (error) {
        setIsSubmittingLoader(false);
      }
    } else {
      try {
        setIsSubmittingLoader(true);
        var form_data = new FormData();
        form_data.append("pageName", "campaign");

        if (hTitle) {
          form_data.append("headerText", hTitle);
        }

        if (hPost) {
          form_data.append("section_post", hPost);
        }

        if (youtubeLinkCampHeader) {
          form_data.append("section_media", youtubeLinkCampHeader);
        }

        const resp = await homePageService.addPageStaticContent(form_data);

        if (resp?.data?.success) {
          showNotification(resp?.data?.message, "Success");

          setIsSubmittingLoader(false);
        } else {
          setIsSubmittingLoader(false);

          showNotification(resp?.data?.message, "Error");
        }
      } catch (error) {
        setIsSubmittingLoader(false);
      }
    }
  };

  useEffect(() => {
    // console.log("Youtube Link => ", youtubeLinkCampHeader);
  }, [youtubeLinkCampHeader]);

  async function setPrevieww(img) {
    let fileData = await getBase64(img);
    setpreview(fileData);
  }
  async function setPrevieww2(img) {
    let fileData = await getBase64(img);
    setpreview2(fileData);
  }
  async function setPrevieww3(img) {
    let fileData = await getBase64(img);
    setpreview3(fileData);
  }
  async function setPrevieww4(img) {
    let fileData = await getBase64(img);
    setpreview4(fileData);
  }

  useEffect(() => {
    if (eqtMedia != "") {
      setPrevieww(eqtMedia);
    }
    if (pMedia != "") {
      setPrevieww2(pMedia);
    }
    if (wMedia != "") {
      setPrevieww3(wMedia);
    }
    if (eduMedia != "") {
      setPrevieww4(eduMedia);
    }
  }, [eqtMedia, pMedia, wMedia, eduMedia]);

  useEffect(() => {
    console.log("eduMedia", eduMedia);
  }, [eduMedia]);

  var sno = 1;
  return (
    <>
      <AdminLayout title={"Campaign - Kindness Admin"}>
        <main role="main">
          {isSubmittingLoader ? (
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
          <section className="panel important">
            <h2>
              {" "}
              <i className="fa fa-hand-o-right" aria-hidden="true"></i>Campaign
              Header
            </h2>
            <div className="container">
              <div className="row">
                <div className="col-md-6">
                  <div className="form-outline">
                    <label className="form-label" htmlFor="typeText">
                      About Us Header
                    </label>
                    <input
                      type="text"
                      value={hTitle}
                      onChange={(e) => setHTitle(e?.target?.value)}
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-outline">
                    <label className="form-label" htmlFor="typeText">
                      Section Post
                    </label>
                    <textarea
                      className="form-control reduceFont "
                      placeholder="Type here"
                      value={hPost}
                      onChange={(e) => setHPost(e?.target?.value)}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            <br />
            <br />

            <div className="mediaSection">
              {ToggleYoutube ? ( //custom file section start
                <div className="container">
                  <div className="row">
                    <div className="col-md-3">
                      <label className="form-label" htmlFor="typeText">
                        Section Media
                      </label>
                    </div>
                    <div className="col-md-3">
                      {adminMedia1?.section_media_type == "video"
                        ? showVideo(
                            adminMedia1?.section_media
                              ? process.env.NEXT_PUBLIC_SITE_URL +
                                  adminMedia1?.section_media
                              : "demo-video.mp4"
                          )
                        : adminMedia1?.section_media_type == "image"
                        ? showImage(
                            adminMedia1?.section_media
                              ? process.env.NEXT_PUBLIC_SITE_URL +
                                  adminMedia1?.section_media
                              : "/no-img.jpg"
                          )
                        : showYoutube(
                            adminMedia1?.section_media
                              ? adminMedia1?.section_media
                              : "demo-video.mp4"
                          )}
                    </div>
                    <div className="col-md-3">
                      <input
                        className="form-control"
                        type="file"
                        onChange={(e) => {
                          const img = e?.target?.files[0];

                          const fileName = img.name.toLowerCase();

                          if (/\.(tiff|eps|avi|wmv|bmp|flv)$/.test(fileName)) {
                            e.target.value = null;
                            showNotification(
                              "File format not supported.",
                              "Error"
                            );
                            return;
                          }

                          // Check if the file has an image extension
                          if (
                            /\.(jpg|jpeg|png|gif|webp|jfif)$/.test(fileName)
                          ) {
                            if (img.size > 6 * 1024 * 1024) {
                              e.target.value = null;
                              showNotification(
                                "Image size exceeds 6MB. Please choose a smaller image.",
                                "Error"
                              );
                              return;
                            } else {
                              setHMedia(e?.target?.files[0]);
                            }
                          } else if (
                            /\.(mp4|mov|mkv|Ff4v|swf|webm)$/.test(fileName)
                          ) {
                            if (img.size > 100 * 1024 * 1024) {
                              e.target.value = null;
                              showNotification(
                                "Video size exceeds 100MB. Please choose a smaller video.",
                                "Error"
                              );
                              return;
                            } else {
                              setHMedia(e?.target?.files[0]);
                            }
                          } else if (
                            /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt|csv|html|jsx|php|js)$/.test(
                              fileName
                            )
                          ) {
                            e.target.value = null;
                            showNotification("Unsupported File type.", "Error");
                            return;
                          } else {
                            setHMedia(e?.target?.files[0]);
                          }
                        }}
                      />
                      <span className="mbSpan">
                        Upload Image/Video only. Max file size for images is 6
                        MB or Video is 100MB
                      </span>
                    </div>

                    <div className="col-md-3">
                      <button
                        type="button"
                        className="btn btn-outline-primary updateBtnSize "
                        onClick={(e) => updatePageHeader(e)}
                      >
                        Update Site
                      </button>
                    </div>
                  </div>
                  <p className="text-center my-4">OR</p>
                  <div className="text-center">
                    <BsYoutube className="youTubeLogo" />
                    <span
                      className="mx-4 custom-youtube-toggleLink"
                      onClick={() => {
                        ToggleYoutube
                          ? setToggleYoutube(false)
                          : setToggleYoutube(true);
                      }}
                    >
                      YouTube Link
                    </span>
                  </div>
                </div>
              ) : (
                //youtube section start
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
                      <span className="mbSpan">Add YouTube video link.</span>
                    </div>

                    <div className="col-md-3">
                      <button
                        type="button"
                        className="btn btn-outline-primary updateBtnSize"
                        onClick={(e) => updatePageHeader(e)}
                      >
                        Update Site
                      </button>
                    </div>
                  </div>
                  <p className="text-center my-4">OR</p>
                  <div className="text-center">
                    <BsFileEarmarkImage className="youTubeLogo" />
                    <span
                      className="mx-4 custom-youtube-toggleLink"
                      onClick={() => {
                        ToggleYoutube
                          ? setToggleYoutube(false)
                          : (setToggleYoutube(true),
                            setyoutubeLinkCampHeader(""));
                      }}
                    >
                      Custom Video
                    </span>
                  </div>
                </div>
              )}
            </div>
          </section>
          <section className="panel important">
            <h2>
              <i className="fa fa-hand-o-right" aria-hidden="true"></i> Equity
              Management
            </h2>

            <section className="panel important">
              <div className="container">
                <div className="row">
                  <label className="form-label" htmlFor="typeText">
                    Health Equity
                  </label>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Order</th>
                              {/* <th>Hits</th> */}
                              <th>Description</th>
                              <th>Media Type </th>
                              <th>Upload Date</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {heathEquityData?.length &&
                              heathEquityData?.map((item, index) => (
                                <tr key={index}>
                                  <td>{index + 1} </td>
                                  {/* <td>132</td> */}
                                  {item?.edit ? (
                                    <>
                                      <td>
                                        <input
                                          type="text"
                                          name="description"
                                          value={text1}
                                          onChange={(e) =>
                                            settext1(e?.target?.value)
                                          }
                                        />
                                      </td>

                                      <td>
                                        {/* {item?.media_type == "video" ? (
                                        <>
                                          <ReactPlayer
                                            url={upMediaPreview}
                                            controls
                                            playing={true}
                                            muted={true}
                                            width="250px"
                                            height="150px"
                                          />
                                        </>
                                      ) : (
                                        <>
                                          {item?.media_type == "image" ? (
                                            <Image
                                              src={upMediaPreview}
                                              width={250}
                                              height={150}
                                            />
                                          ) : (
                                            <ReactPlayer
                                              url={upMediaPreview}
                                              controls
                                              playing={true}
                                              muted={true}
                                              width={"250px"}
                                              height={"150px"}
                                            />
                                          )}
                                        </>
                                      )} */}

                                        {/* <input
                                        type="file"
                                        onChange={(e) =>
                                          onchangeFile(e, "healthEquity")
                                        }
                                      /> */}
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
                                              onChange={(e) =>
                                                onchangeFile(e, "healthEquity")
                                              }
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
                                      <td></td>
                                    </>
                                  ) : (
                                    <>
                                      <td>{item?.description}</td>
                                      <td>{item?.media_type}</td>
                                      <td>
                                        {" "}
                                        {getFormatedDate(
                                          item?.updated_at,
                                          "MM/DD/YYYY"
                                        )}{" "}
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
                                              "healthEquity"
                                            )
                                          : editFieldData(
                                              item?.id,
                                              index,
                                              "healthEquity"
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
                                        deleteData(item.id, "HealthEquity")
                                      }
                                    >
                                      <i
                                        className="fa fa-trash-o"
                                        aria-hidden="true"
                                      />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="container">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="form-outline">
                              <label className="form-label" htmlFor="typeText">
                                Image Description
                              </label>
                              <input
                                value={eqtDes}
                                type="text"
                                onChange={(e) => setEqtDes(e?.target?.value)}
                              />
                            </div>
                          </div>

                          {toggleHealthYoutube ? (
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
                                    {youtubeLinkValueHealth != ""
                                      ? showVideo(youtubeLinkValueHealth)
                                      : showVideo("no-video")}
                                  </div>
                                  <div className="col-md-3">
                                    <input
                                      className="form-control"
                                      type="text"
                                      value={youtubeLinkValueHealth}
                                      onChange={(e) => {
                                        const inputValue =
                                          e.target.value.trim();
                                        setyoutubeLinkValueHealth(inputValue);
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
                                      onClick={(e) => updateEqt(e)}
                                    >
                                      Update Site
                                    </button>
                                  </div>
                                </div>

                                <div className="text-center youTubeOption2">
                                  <span
                                    className="mx-4 custom-youtube-toggleLink"
                                    onClick={() => {
                                      toggleHealthYoutube
                                        ? setToggleHalthYoutube(false)
                                        : (setToggleHalthYoutube(true),
                                          setyoutubeLinkValueHealth(""));
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
                                <label
                                  className="form-label"
                                  htmlFor="typeText"
                                >
                                  Add News Media
                                </label>
                              </div>
                              <div className="col-md-3">
                                <Image
                                  src={`${
                                    preview == "" ? "/no-img.jpg" : preview
                                  }`}
                                  width={80}
                                  height={80}
                                  alt="Picture of the author"
                                />
                              </div>
                              <div className="col-md-3">
                                <label
                                  className="form-label"
                                  htmlFor="typeText"
                                >
                                  Upload Image
                                </label>
                                <input
                                  className="form-control"
                                  type="file"
                                  onChange={(e) => {
                                    const img = e?.target?.files[0];

                                    const fileName = img?.name?.toLowerCase();

                                    // Check if the file has an image extension
                                    if (
                                      /\.(jpg|jpeg|png|gif|webp|tiff|bmp|jfif)$/.test(
                                        fileName
                                      )
                                    ) {
                                      if (img.size > 6 * 1024 * 1024) {
                                        e.target.value = null;
                                        showNotification(
                                          "Image size exceeds 6MB. Please choose a smaller image.",
                                          "Error"
                                        );
                                        return;
                                      } else {
                                        setEqtMedia(e?.target?.files[0]);
                                      }
                                    } else if (
                                      /\.(mp4|mov|avi|wmv|mkv|flv|Ff4v|swf|webm)$/.test(
                                        fileName
                                      )
                                    ) {
                                      if (img.size > 100 * 1024 * 1024) {
                                        e.target.value = null;
                                        showNotification(
                                          "Video size exceeds 100MB. Please choose a smaller video.",
                                          "Error"
                                        );
                                        return;
                                      } else {
                                        setEqtMedia(e?.target?.files[0]);
                                      }
                                    } else if (
                                      /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt|csv|html|js|jsx|php)$/.test(
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
                                <span className="mbSpan">
                                  Max file size for images is 6 MB, video 100 MB
                                </span>
                              </div>

                              <div className="col-md-3">
                                <button
                                  type="button"
                                  className="btn btn-outline-primary updateBtnSize"
                                  onClick={(e) => updateEqt(e)}
                                >
                                  Update Site
                                </button>
                              </div>
                              <div
                                style={{ width: "100%" }}
                                className="d-flex justify-content-center align-items-center youTubeOption2"
                              >
                                <span
                                  className="mx-4 custom-youtube-toggleLink"
                                  onClick={() => {
                                    toggleHealthYoutube
                                      ? setToggleHalthYoutube(false)
                                      : setToggleHalthYoutube(true);
                                  }}
                                >
                                  <BsYoutube id="youTubelogo" />
                                  YouTube Link
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="panel important">
              <div className="container">
                <div className="row">
                  <label className="form-label" htmlFor="typeText">
                    Education Equity
                  </label>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Order</th>

                              <th>Description</th>
                              <th>Media Type </th>
                              <th>Upload Date</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {educationEquityData?.length &&
                              educationEquityData?.map((item, index) => (
                                <tr key={index}>
                                  <td>{index + 1} </td>

                                  {item?.edit ? (
                                    <>
                                      <td>
                                        <input
                                          type="text"
                                          name="description"
                                          value={text3}
                                          onChange={(e) =>
                                            settext3(e?.target?.value)
                                          }
                                        />
                                      </td>

                                      <td>
                                        {/* <input
                                        type="file"
                                        onChange={(e) =>
                                          onchangeFile(e, "educationEquity")
                                        }
                                      />
                                      {console.log("item.media", item.media)}

                                      {item?.media_type == "video" ? (
                                        <>
                                          <ReactPlayer
                                            url={upMediaPreview3}
                                            controls
                                            playing={true}
                                            muted={true}
                                            width="250px"
                                            height="150px"
                                          />
                                        </>
                                      ) : item?.media_type == "image" ? (
                                        <Image
                                          src={
                                            item.media
                                              ? process.env.NEXT_PUBLIC_SITE_URL +
                                                item.media
                                              : "/no-img.jpg"
                                          }
                                          width={80}
                                          height={80}
                                        />
                                      ) : (
                                        <ReactPlayer
                                          url={item.media}
                                          controls
                                          playing={true}
                                          muted={true}
                                          width={"250px"}
                                          height={"150px"}
                                        />
                                      )} */}
                                        {toggleEduYT ? (
                                          <>
                                            <div className="">
                                              {updateYTdataEdu != ""
                                                ? showVideo(updateYTdataEdu)
                                                : showVideo("no-video")}
                                            </div>
                                            <div className="">
                                              <input
                                                className=""
                                                type="text"
                                                value={updateYTdataEdu}
                                                onChange={(e) => {
                                                  const inputValue =
                                                    e.target.value.trim();
                                                  setupdateYTdataEdu(
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
                                                  toggleEduYT
                                                    ? settoggleEduYT(false)
                                                    : (settoggleEduYT(true),
                                                      settoggleEduYT(""));
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
                                              onChange={(e) =>
                                                onchangeFile(
                                                  e,
                                                  "educationEquity"
                                                )
                                              }
                                            />
                                            <div
                                              style={{ width: "100%" }}
                                              className=""
                                            >
                                              <span
                                                className="mx-4 custom-youtube-toggleLink"
                                                onClick={() => {
                                                  toggleEduYT
                                                    ? settoggleEduYT(false)
                                                    : settoggleEduYT(true);
                                                }}
                                              >
                                                <BsYoutube id="youTubelogo" />
                                                YouTube Link
                                              </span>
                                            </div>
                                          </>
                                        )}
                                      </td>
                                      <td></td>
                                    </>
                                  ) : (
                                    <>
                                      <td>{item?.description}</td>
                                      <td>{item?.media_type}</td>
                                      <td>
                                        {" "}
                                        {getFormatedDate(
                                          item?.updated_at,
                                          "MM/DD/YYYY"
                                        )}{" "}
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
                                              "EducationEquity"
                                            )
                                          : editFieldData(
                                              item?.id,
                                              index,
                                              "EducationEquity"
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
                                        deleteData(item.id, "EducationEquity")
                                      }
                                    >
                                      <i
                                        className="fa fa-trash-o"
                                        aria-hidden="true"
                                      />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="container">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="form-outline">
                              <label className="form-label" htmlFor="typeText">
                                Image Description
                              </label>
                              <input
                                value={eduDes}
                                type="text"
                                onChange={(e) => setEduDes(e?.target?.value)}
                              />
                            </div>
                          </div>
                          {toggleEducationYoutube ? (
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
                                    {youtubeLinkValueEducation != ""
                                      ? showVideo(youtubeLinkValueEducation)
                                      : showVideo("no-video")}
                                  </div>
                                  <div className="col-md-3">
                                    <input
                                      className="form-control"
                                      type="text"
                                      value={youtubeLinkValueEducation}
                                      onChange={(e) => {
                                        const inputValue =
                                          e.target.value.trim();
                                        setyoutubeLinkValueEducation(
                                          inputValue
                                        );
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
                                      onClick={(e) => updateEdu(e)}
                                    >
                                      Update Site
                                    </button>
                                  </div>
                                </div>

                                <div className="text-center youTubeOption2">
                                  <span
                                    className="mx-4 custom-youtube-toggleLink"
                                    onClick={() => {
                                      toggleEducationYoutube
                                        ? setToggleEducationYoutube(false)
                                        : (setToggleEducationYoutube(true),
                                          setyoutubeLinkValueEducation(""));
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
                                <label
                                  className="form-label"
                                  htmlFor="typeText"
                                >
                                  Add News Media
                                </label>
                              </div>
                              <div className="col-md-3">
                                <Image
                                  src={`${
                                    preview4 == "" ? "/no-img.jpg" : preview4
                                  }`}
                                  width={80}
                                  height={80}
                                  alt="Picture of the author"
                                />
                              </div>
                              <div className="col-md-3">
                                <label
                                  className="form-label"
                                  htmlFor="typeText"
                                >
                                  Upload File
                                </label>
                                <input
                                  className="form-control"
                                  type="file"
                                  onChange={(e) => {
                                    const img = e?.target?.files[0];

                                    const fileName = img?.name?.toLowerCase();

                                    // Check if the file has an image extension
                                    if (
                                      /\.(jpg|jpeg|png|gif|webp|jfif|bmp)$/.test(
                                        fileName
                                      )
                                    ) {
                                      if (img.size > 6 * 1024 * 1024) {
                                        e.target.value = null;
                                        showNotification(
                                          "Image size exceeds 6MB. Please choose a smaller image.",
                                          "Error"
                                        );
                                        return;
                                      } else {
                                        setEduMedia(e?.target?.files[0]);
                                      }
                                    } else if (
                                      /\.(mp4|mov|avi|wmv|mkv|flv|Ff4v|swf|webm)$/.test(
                                        fileName
                                      )
                                    ) {
                                      if (img.size > 100 * 1024 * 1024) {
                                        e.target.value = null;
                                        showNotification(
                                          "Video size exceeds 100MB. Please choose a smaller video.",
                                          "Error"
                                        );
                                        return;
                                      } else {
                                        setEduMedia(e?.target?.files[0]);
                                      }
                                    } else if (
                                      /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt|csv|html|js|jsx|php)$/.test(
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
                                <span className="mbSpan">
                                  Max file size for images is 6 MB, video 100 MB
                                </span>
                              </div>

                              <div className="col-md-3">
                                <button
                                  type="button"
                                  className="btn btn-outline-primary updateBtnSize"
                                  onClick={(e) => updateEdu(e)}
                                >
                                  Update Site
                                </button>
                              </div>
                              <div
                                style={{ width: "100%" }}
                                className="d-flex justify-content-center align-items-center youTubeOption2"
                              >
                                <span
                                  className="mx-4 custom-youtube-toggleLink"
                                  onClick={() => {
                                    toggleEducationYoutube
                                      ? setToggleEducationYoutube(false)
                                      : setToggleEducationYoutube(true);
                                  }}
                                >
                                  <BsYoutube id="youTubelogo" />
                                  YouTube Link
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="panel important">
              <div className="container">
                <div className="row">
                  <label className="form-label" htmlFor="typeText">
                    Workforce Equity
                  </label>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Order</th>

                              <th>Description</th>
                              <th>Media Type </th>
                              <th>Upload Date</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {workforceEquityData?.length &&
                              workforceEquityData.map((item, index) => (
                                <tr key={index}>
                                  <td>{index + 1} </td>

                                  {item?.edit ? (
                                    <>
                                      <td>
                                        <input
                                          type="text"
                                          name="description"
                                          value={text2}
                                          onChange={(e) =>
                                            settext2(e?.target?.value)
                                          }
                                        />
                                      </td>

                                      <td>
                                        {/* {item?.media_type == "video" ? (
                                        <>
                                          <ReactPlayer
                                            url={upMediaPreview2}
                                            controls
                                            playing={true}
                                            muted={true}
                                            width="250px"
                                            height="150px"
                                          />
                                        </>
                                      ) : item?.media_type == "image" ? (
                                        <Image
                                          src={
                                            item.media
                                              ? process.env.NEXT_PUBLIC_SITE_URL +
                                                item.media
                                              : "/no-img.jpg"
                                          }
                                          width={80}
                                          height={80}
                                        />
                                      ) : (
                                        <ReactPlayer
                                          url={item.media}
                                          controls
                                          playing={true}
                                          muted={true}
                                          width={"250px"}
                                          height={"150px"}
                                        />
                                      )} */}
                                        {/* <Image
                                        src={
                                          upMediaPreview2
                                            ? upMediaPreview2
                                            : "/no-img.jpg"
                                        }
                                        width={80}
                                        height={80}
                                      /> */}
                                        {/* <input
                                        type="file"
                                        onChange={(e) =>
                                          onchangeFile(e, "WorkforceEquity")
                                        }
                                      /> */}
                                        {toggleWorkYT ? (
                                          <>
                                            <div className="">
                                              {updateYTdataWork != ""
                                                ? showVideo(updateYTdataWork)
                                                : showVideo("no-video")}
                                            </div>
                                            <div className="">
                                              <input
                                                className=""
                                                type="text"
                                                value={updateYTdataWork}
                                                onChange={(e) => {
                                                  const inputValue =
                                                    e.target.value.trim();
                                                  setupdateYTdataWork(
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
                                                  toggleWorkYT
                                                    ? settoggleWorkYT(false)
                                                    : (settoggleWorkYT(true),
                                                      settoggleWorkYT(""));
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
                                              onChange={(e) =>
                                                onchangeFile(
                                                  e,
                                                  "WorkforceEquity"
                                                )
                                              }
                                            />
                                            <div
                                              style={{ width: "100%" }}
                                              className=""
                                            >
                                              <span
                                                className="mx-4 custom-youtube-toggleLink"
                                                onClick={() => {
                                                  toggleWorkYT
                                                    ? settoggleWorkYT(false)
                                                    : settoggleWorkYT(true);
                                                }}
                                              >
                                                <BsYoutube id="youTubelogo" />
                                                YouTube Link
                                              </span>
                                            </div>
                                          </>
                                        )}
                                      </td>
                                      <td></td>
                                    </>
                                  ) : (
                                    <>
                                      <td>{item?.description}</td>
                                      <td>{item?.media_type}</td>
                                      <td>
                                        {" "}
                                        {getFormatedDate(
                                          item?.updated_at,
                                          "MM/DD/YYYY"
                                        )}{" "}
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
                                              "WorkforceEquity"
                                            )
                                          : editFieldData(
                                              item?.id,
                                              index,
                                              "WorkforceEquity"
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
                                        deleteData(item.id, "WorkforceEquity")
                                      }
                                    >
                                      <i
                                        className="fa fa-trash-o"
                                        aria-hidden="true"
                                      />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="container">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="form-outline">
                              <label className="form-label" htmlFor="typeText">
                                Image Description
                              </label>
                              <input
                                value={wDes}
                                type="text"
                                onChange={(e) => setWDes(e?.target?.value)}
                              />
                            </div>
                          </div>
                          {toggleWorkforceYoutube ? (
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
                                    {youtubeLinkValueWorkforce != ""
                                      ? showVideo(youtubeLinkValueWorkforce)
                                      : showVideo("no-video")}
                                  </div>
                                  <div className="col-md-3">
                                    <input
                                      className="form-control"
                                      type="text"
                                      value={youtubeLinkValueWorkforce}
                                      onChange={(e) => {
                                        const inputValue =
                                          e.target.value.trim();
                                        setyoutubeLinkValueWorkforce(
                                          inputValue
                                        );
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
                                      onClick={(e) => updateWork(e)}
                                    >
                                      Update Site
                                    </button>
                                  </div>
                                </div>

                                <div className="text-center youTubeOption2">
                                  <span
                                    className="mx-4 custom-youtube-toggleLink"
                                    onClick={() => {
                                      toggleWorkforceYoutube
                                        ? setToggleWorkforceYoutube(false)
                                        : (setToggleWorkforceYoutube(true),
                                          setyoutubeLinkValueWorkforce(""));
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
                                <label
                                  className="form-label"
                                  htmlFor="typeText"
                                >
                                  Add Media
                                </label>
                              </div>
                              <div className="col-md-3">
                                <Image
                                  src={`${
                                    preview3 == "" ? "/no-img.jpg" : preview3
                                  }`}
                                  width={80}
                                  height={80}
                                  alt="Picture of the author"
                                />
                              </div>
                              <div className="col-md-3">
                                <label
                                  className="form-label"
                                  htmlFor="typeText"
                                >
                                  Upload Image
                                </label>
                                <input
                                  className="form-control"
                                  type="file"
                                  onChange={(e) => {
                                    const img = e?.target?.files[0];

                                    const fileName = img.name.toLowerCase();

                                    // Check if the file has an image extension
                                    if (
                                      /\.(jpg|jpeg|png|gif|webp|jfif)$/.test(
                                        fileName
                                      )
                                    ) {
                                      if (img.size > 6 * 1024 * 1024) {
                                        e.target.value = null;
                                        showNotification(
                                          "Image size exceeds 2MB. Please choose a smaller image.",
                                          "Error"
                                        );
                                        return;
                                      } else {
                                        setWMedia(e?.target?.files[0]);
                                      }
                                    } else if (
                                      /\.(mp4|mov|mkv|Ff4v|swf|webm)$/.test(
                                        fileName
                                      )
                                    ) {
                                      if (img.size > 100 * 1024 * 1024) {
                                        e.target.value = null;
                                        showNotification(
                                          "Video size exceeds 10MB. Please choose a smaller video.",
                                          "Error"
                                        );
                                        return;
                                      } else {
                                        setWMedia(e?.target?.files[0]);
                                      }
                                    } else if (
                                      /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt|csv|html|jsx|js|php|tiff|eps|avi|wmv|bmp|flv)$/.test(
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
                                <span className="mbSpan">
                                  Max file size for images is 6 MB,video 100 MB
                                </span>
                              </div>

                              <div className="col-md-3">
                                <button
                                  type="button"
                                  className="btn btn-outline-primary updateBtnSize"
                                  onClick={(e) => updateWork(e)}
                                >
                                  Update Site
                                </button>
                              </div>
                              <div
                                style={{ width: "100%" }}
                                className="d-flex justify-content-center align-items-center youTubeOption2"
                              >
                                <span
                                  className="mx-4 custom-youtube-toggleLink"
                                  onClick={() => {
                                    toggleWorkforceYoutube
                                      ? setToggleWorkforceYoutube(false)
                                      : setToggleWorkforceYoutube(true);
                                  }}
                                >
                                  <BsYoutube id="youTubelogo" />
                                  YouTube Link
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="panel important">
              <div className="container">
                <div className="row">
                  <label className="form-label" htmlFor="typeText">
                    Public Equity
                  </label>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Order</th>

                              <th>Description</th>
                              <th>Media Type </th>
                              <th>Upload Date</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {publicEquityData?.length &&
                              publicEquityData?.map((item, index) => (
                                <tr key={index}>
                                  <td>{index + 1} </td>

                                  {item?.edit ? (
                                    <>
                                      <td>
                                        <input
                                          type="text"
                                          name="description"
                                          value={text4}
                                          onChange={(e) =>
                                            settext4(e?.target?.value)
                                          }
                                        />
                                      </td>

                                      <td>
                                        {/* <Image
                                        src={
                                          upMediaPreview4
                                            ? upMediaPreview4
                                            : "/no-img.jpg"
                                        }
                                        width={80}
                                        height={80}
                                      /> */}
                                        {/* {item?.media_type == "video" ? (
                                        <>
                                          <ReactPlayer
                                            url={
                                              process.env.NEXT_PUBLIC_SITE_URL + item.media
                                            }
                                            controls
                                            playing={true}
                                            muted={true}
                                            width="250px"
                                            height="150px"
                                          />
                                        </>
                                      ) : item?.media_type == "image" ? (
                                        <Image
                                          src={
                                            item.media
                                              ? process.env.NEXT_PUBLIC_SITE_URL +
                                                item.media
                                              : "/no-img.jpg"
                                          }
                                          width={80}
                                          height={80}
                                        />
                                      ) : (
                                        <ReactPlayer
                                          url={item.media}
                                          controls
                                          playing={true}
                                          muted={true}
                                          width={"250px"}
                                          height={"150px"}
                                        />
                                      )}
                                      <input
                                        type="file"
                                        onChange={(e) =>
                                          onchangeFile(e, "PublicEquity")
                                        }
                                      /> */}
                                        {togglePublicYT ? (
                                          <>
                                            <div className="">
                                              {updateYTdataPublic != ""
                                                ? showVideo(updateYTdataPublic)
                                                : showVideo("no-video")}
                                            </div>
                                            <div className="">
                                              <input
                                                className=""
                                                type="text"
                                                value={updateYTdataPublic}
                                                onChange={(e) => {
                                                  const inputValue =
                                                    e.target.value.trim();
                                                  setupdateYTdataPublic(
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
                                                  togglePublicYT
                                                    ? settogglePublicYT(false)
                                                    : (settogglePublicYT(true),
                                                      settogglePublicYT(""));
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
                                              onChange={(e) =>
                                                onchangeFile(e, "PublicEquity")
                                              }
                                            />
                                            <div
                                              style={{ width: "100%" }}
                                              className=""
                                            >
                                              <span
                                                className="mx-4 custom-youtube-toggleLink"
                                                onClick={() => {
                                                  togglePublicYT
                                                    ? settogglePublicYT(false)
                                                    : settogglePublicYT(true);
                                                }}
                                              >
                                                <BsYoutube id="youTubelogo" />
                                                YouTube Link
                                              </span>
                                            </div>
                                          </>
                                        )}
                                      </td>
                                      <td></td>
                                    </>
                                  ) : (
                                    <>
                                      <td>{item?.description}</td>
                                      <td>{item?.media_type}</td>
                                      <td>
                                        {getFormatedDate(
                                          item?.updated_at,
                                          "MM/DD/YYYY"
                                        )}
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
                                              "PublicEquity"
                                            )
                                          : editFieldData(
                                              item?.id,
                                              index,
                                              "PublicEquity"
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
                                        deleteData(item.id, "PublicEquity")
                                      }
                                    >
                                      <i
                                        className="fa fa-trash-o"
                                        aria-hidden="true"
                                      />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="container">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="form-outline">
                              <label className="form-label" htmlFor="typeText">
                                Image Description
                              </label>
                              <input
                                value={pDes}
                                type="text"
                                onChange={(e) => setPDes(e?.target?.value)}
                              />
                            </div>
                          </div>
                          {togglePublicYoutube ? (
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
                                    {youtubeLinkValuePublic != ""
                                      ? showVideo(youtubeLinkValuePublic)
                                      : showVideo("no-video")}
                                  </div>
                                  <div className="col-md-3">
                                    <input
                                      className="form-control"
                                      type="text"
                                      value={youtubeLinkValuePublic}
                                      onChange={(e) => {
                                        const inputValue =
                                          e.target.value.trim();
                                        setyoutubeLinkValuePublic(inputValue);
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
                                      onClick={(e) => updatePublic(e)}
                                    >
                                      Update Site
                                    </button>
                                  </div>
                                </div>

                                <div className="text-center youTubeOption2">
                                  <span
                                    className="mx-4 custom-youtube-toggleLink"
                                    onClick={() => {
                                      togglePublicYoutube
                                        ? setTogglePublicYoutube(false)
                                        : (setTogglePublicYoutube(true),
                                          setyoutubeLinkValuePublic(""));
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
                                <label
                                  className="form-label"
                                  htmlFor="typeText"
                                >
                                  Add Media
                                </label>
                              </div>
                              <div className="col-md-3">
                                <Image
                                  src={`${
                                    preview2 == "" ? "/no-img.jpg" : preview2
                                  }`}
                                  width={80}
                                  height={80}
                                  alt="Picture of the author"
                                />
                              </div>
                              <div className="col-md-3">
                                <label
                                  className="form-label"
                                  htmlFor="typeText"
                                >
                                  Upload Image
                                </label>
                                <input
                                  className="form-control"
                                  type="file"
                                  onChange={(e) => {
                                    const img = e?.target?.files[0];

                                    const fileName = img?.name?.toLowerCase();

                                    // Check if the file has an image extension
                                    if (
                                      /\.(jpg|jpeg|png|gif|webp|tiff|bmp|jfif)$/.test(
                                        fileName
                                      )
                                    ) {
                                      if (img.size > 6 * 1024 * 1024) {
                                        e.target.value = null;
                                        showNotification(
                                          "Image size exceeds 6MB. Please choose a smaller image.",
                                          "Error"
                                        );
                                        return;
                                      } else {
                                        setPMedia(e?.target?.files[0]);
                                      }
                                    } else if (
                                      /\.(mp4|mov|avi|wmv|mkv|flv|Ff4v|swf|webm)$/.test(
                                        fileName
                                      )
                                    ) {
                                      if (img.size > 100 * 1024 * 1024) {
                                        e.target.value = null;
                                        showNotification(
                                          "Video size exceeds 100MB. Please choose a smaller video.",
                                          "Error"
                                        );
                                        return;
                                      } else {
                                        setPMedia(e?.target?.files[0]);
                                      }
                                    } else if (
                                      /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt|csv|html|js|jsx|php)$/.test(
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
                                <span className="mbSpan">
                                  Max file size for images is 6 MB, video 100 MB
                                </span>
                              </div>

                              <div className="col-md-3">
                                <button
                                  type="button"
                                  className="btn btn-outline-primary updateBtnSize"
                                  onClick={(e) => updatePublic(e)}
                                >
                                  Update Site
                                </button>
                              </div>
                              <div
                                style={{ width: "100%" }}
                                className="d-flex justify-content-center align-items-center youTubeOption2"
                              >
                                <span
                                  className="mx-4 custom-youtube-toggleLink"
                                  onClick={() => {
                                    togglePublicYoutube
                                      ? setTogglePublicYoutube(false)
                                      : setTogglePublicYoutube(true);
                                  }}
                                >
                                  <BsYoutube id="youTubelogo" />
                                  YouTube Link
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </section>
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

export default Compaign_page;
