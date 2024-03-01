import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Link from "next/link";
import AdminLayout from "@/layout/adminLayout";
import { getInvolvePageSevices } from "@/store/services/getInvolvedPageService";
import showNotification from "@/helpers/show_notification";
import { randomKey, getFormatedDate, getBase64 } from "@/store/library/utils";
import { Spinner } from "react-bootstrap";
import axios from "axios";

const GetInvolved = () => {
  const [learnMoreList, setlearnMoreList] = useState([]);
  const [signUpList, setSignUpList] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [interest, setinterest] = useState("");
  const [active, setactive] = useState("");
  const [volText, setVolText] = useState("");
  const [volunteerText, setVolunteerText] = useState("");
  const [partnerText, setpartnerText] = useState("");
  const [interestList, setinterestList] = useState([]);
  //states for update API public Equity - piyush
  const [text, settext] = useState();
  const [downloadLoader, setDownloadLoader] = useState(false);
  const [isSubmitingLoader, setIsSubmitingLoader] = useState(false);
  const [updateEmailSgnup, setupdateEmailSgnup] = useState();

  const [editDesActive, setEditDesActive] = useState(0);
  //function to update data - piyush
  function editFieldData(id, index, sectionName) {
    if (sectionName == "InterestList") {
      let data = interestList[index];
      data.edit = true;

      interestList[index] = data;
      setinterestList([...interestList]);
      // console.log(data);
      // console.log('data?.active', typeof data?.active);
      settext(data?.interest_type);
      setEditDesActive(data?.active == "1" ? true : false);
    }
    if (sectionName == "SignupList") {
      let data = signUpList[index];
      data.edit = true;

      signUpList[index] = data;
      setSignUpList([...signUpList]);
      // console.log(data);
      // console.log('data?.active', typeof data?.active);
      setupdateEmailSgnup(data?.email);
    }

    // showNotification("Item Updated", "Success");
  }

  const updateFormData = async (id, sectionName) => {
    try {
      if (sectionName == "InterestList") {
        setIsSubmitingLoader(true);
        const formData = new FormData();
        formData.append("updateId", id);
        formData.append("interest", text);
        formData.append("active", editDesActive ? 1 : 0);
        try {
          const resp = await getInvolvePageSevices.updateInterestSetupSection(
            formData
          );

          if (resp?.data?.success) {
            showNotification(resp?.data?.message, "Success");
            getInterestList();
            setIsSubmitingLoader(false);
          } else {
            setIsSubmitingLoader(false);

            showNotification(resp?.data?.message, "Error");
          }
        } catch (err) {
          // Handle any other errors that may occur during the request
          setIsSubmitingLoader(false);
          console.log(err);
        }
      }

      if (sectionName == "SignupList") {
        setIsSubmitingLoader(true);
        const formData = new FormData();
        formData.append("updId", id);
        formData.append("email", updateEmailSgnup);

        try {
          const result = await axios.post(
            process.env.NEXT_PUBLIC_SITE_URL + "api/updateSignUp",
            formData
          );
          console.log("signup", result);

          if (result?.data?.success == true) {
            showNotification(result?.data?.message, "Success");
            getSignupListData();
            setIsSubmitingLoader(false);
          } else {
            setIsSubmitingLoader(false);

            showNotification(result?.data?.message, "Error");
          }
        } catch (err) {
          // Handle any other errors that may occur during the request
          setIsSubmitingLoader(false);
          console.log(err);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  //function to delete the table data - piyush
  async function deleteData(data, sectionName) {
    if (sectionName == "InterestList") {
      try {
        setIsSubmitingLoader(true);

        const params = { delId: data };
        const delResp = await getInvolvePageSevices.deleteInterestList(params);

        const newInterestList = interestList.filter((item) => item.id != data);
        setinterestList(newInterestList);
        setIsSubmitingLoader(false);

        showNotification("Item deleted", "Success");
      } catch (error) {
        setIsSubmitingLoader(false);
        console.log(error);
      }
    }
    if (sectionName == "LearnMoreList") {
      try {
        setIsSubmitingLoader(true);
        const params = { delId: data };
        const delResp = await getInvolvePageSevices.deleteLearnMoreList(params);
        getSignupListData();

        // const newLearnMoreList = learnMoreList.filter(
        //   (item) => item.id != data
        // );
        // setlearnMoreList(newLearnMoreList);
        setIsSubmitingLoader(false);
        if (delResp?.data?.success) {
          showNotification("Item deleted", "Success");
        } else {
          showNotification("Item not deleted", "Error");
        }
      } catch (error) {
        setIsSubmitingLoader(false);
        console.log(error);
      }
    }
    if (sectionName == "SignUpList") {
      try {
        setIsSubmitingLoader(true);
        const params = { delId: data };
        const delResp = await getInvolvePageSevices.deleteSignUP(params);
        getSignupListData();
        console.log("SignupList", delResp);
        setIsSubmitingLoader(false);
        if (delResp?.data?.success) {
          showNotification("Item deleted", "Success");
        } else {
          showNotification("Item not deleted", "Error");
        }

        // const newLearnMoreList = learnMoreList.filter(
        //   (item) => item.id != data
        // );
        // setlearnMoreList(newLearnMoreList);
        // setIsSubmitingLoader(false);
        // showNotification("Item deleted", "Success");
      } catch (error) {
        setIsSubmitingLoader(false);
        console.log(error);
      }
    }
  }

  async function updateData(data) {
    if (data == "section1") {
      if (interest != "") {
        setIsSubmitingLoader(true);

        const formData = new FormData();
        formData.append("interest", interest);
        formData.append("active", active ? "1" : "0");
        try {
          const resp = await getInvolvePageSevices.updateInterestSetupSection(
            formData
          );

          if (resp?.data?.success) {
            setIsSubmitingLoader(false);
            getInterestList();
            showNotification(resp?.data?.message, "Success");
            setinterest("");
            setactive("");
          } else {
            setIsSubmitingLoader(false);
            showNotification(resp?.data?.message, "Error");
          }
        } catch (err) {
          // Handle any other errors that may occur during the request
          setIsSubmitingLoader(false);
          console.log(err);
        }
      } else {
        showNotification("Please fill all the fields", "Error");
      }
    } else if (data == "section2") {
      if (volText != "") {
        setIsSubmitingLoader(true);
        const formData = new FormData();
        formData.append("pageName", "get_involved");
        formData.append("learnMoreHeader", volText);

        try {
          const resp = await getInvolvePageSevices.updateLearnMoreSection(
            formData
          );
          if (resp?.data?.success) {
            camppage2();
            setIsSubmitingLoader(false);
            setVolText("");
            showNotification(resp?.data?.message, "Success");
          } else {
            setIsSubmitingLoader(false);
            showNotification(resp?.data?.message, "Error");
          }
        } catch (err) {
          // Handle any other errors that may occur during the request
          setIsSubmitingLoader(false);
          console.log(err);
        }
      } else {
        showNotification("Please fill all the fields", "Error");
      }
    } else if (data == "section3") {
      if (volunteerText != "") {
        setIsSubmitingLoader(true);
        const formData = new FormData();
        formData.append("pageName", "get_involved");
        formData.append("volunteerText", volunteerText);

        try {
          const resp = await getInvolvePageSevices.updateLearnMoreSection(
            formData
          );
          if (resp?.data?.success) {
            camppage2();
            setIsSubmitingLoader(false);
            setVolunteerText("");

            showNotification(resp?.data?.message, "Success");
          } else {
            setIsSubmitingLoader(false);
            showNotification(resp?.data?.message, "Error");
          }
        } catch (err) {
          // Handle any other errors that may occur during the request
          setIsSubmitingLoader(false);
          console.log(err);
        }
      } else {
        showNotification("Please fill all the fields", "Error");
      }
    } else if (data == "section4") {
      if (partnerText != "") {
        setIsSubmitingLoader(true);

        const formData = new FormData();
        formData.append("pageName", "get_involved");
        formData.append("partnerText", partnerText);

        try {
          const resp = await getInvolvePageSevices.updateLearnMoreSection(
            formData
          );
          if (resp?.data?.success) {
            camppage2();
            setIsSubmitingLoader(false);
            setpartnerText("");
            showNotification(resp?.data?.message, "Success");
          } else {
            setIsSubmitingLoader(false);
            showNotification(resp?.data?.message, "Error");
          }
        } catch (err) {
          // Handle any other errors that may occur during the request
          setIsSubmitingLoader(false);
          console.log(err);
        }
      } else {
        showNotification("Please fill all the fields", "Error");
      }
    }
  }

  const getInterestList = async () => {
    try {
      const intListresp = await getInvolvePageSevices.getInterestList();
      setinterestList(intListresp?.data?.data);
    } catch (err) {
      // Handle any other errors that may occur during the request
      console.log(err);
    }
  };

  const camppage2 = async () => {
    try {
      const resp2 = await getInvolvePageSevices.getStaticDataPiyush();
      if (resp2?.data?.data) {
        console.log("======>", resp2?.data?.data);
        setVolunteerText(resp2?.data?.data[3]?.header_text);
        setpartnerText(resp2?.data?.data[3]?.page_text);
        setVolText(resp2?.data?.data[3]?.section_post);
      }
    } catch (err) {
      // Handle any other errors that may occur during the request
      console.log(err);
    }
  };

  const getSignupListData = async () => {
    try {
      let params = {};
      const signupResp = await getInvolvePageSevices.getSignupListData(params);
      console.log("learn more data", signupResp.data.learn_more.data);
      setlearnMoreList(signupResp.data.learn_more.data);
      setSignUpList(signupResp.data.sign_up.data);
      console.log("signupList Data", signupResp.data.sign_up.data);
    } catch (err) {
      // Handle any other errors that may occur during the request
      console.log(err);
    }
  };
  useEffect(() => {
    getInterestList();
    getSignupListData();
    camppage2();
  }, []);

  const downloadSignupReport = async () => {
    try {
      setDownloadLoader(true);
      let resp = await getInvolvePageSevices.downloadSignUpReport();

      if (resp?.data?.success && resp?.data?.download_link) {
        let a = document.createElement("a");
        a.href = process.env.NEXT_PUBLIC_SITE_URL + resp?.data?.download_link;
        a.click();
        setDownloadLoader(false);
      } else {
        setDownloadLoader(false);
      }
    } catch (error) {
      setDownloadLoader(false);
      console.log(error);
    }
  };

  const downloadLearnMoreData = async () => {
    try {
      setDownloadLoader(true);
      let params = {};
      params.start_date = getFormatedDate(startDate, "DD-MM-YYYY");
      params.end_date = getFormatedDate(endDate, "DD-MM-YYYY");
      let resp = await getInvolvePageSevices.downloadLearnMore(params);

      if (resp?.data?.success) {
        let a = document.createElement("a");
        a.href = process.env.NEXT_PUBLIC_SITE_URL + resp?.data?.download_link;
        a.click();
        setDownloadLoader(false);
        showNotification("File Downloaded Successfully", "Success");
      } else {
        setDownloadLoader(false);
        showNotification("No Downloadable data Found", "Error");
      }
    } catch (error) {
      setDownloadLoader(false);
      console.log(error);
    }
  };

  return (
    <>
      <AdminLayout title={"Admin panel"}>
        <main role="main">
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
          <section className="panel important">
            <h2>
              {" "}
              <i className="fa fa-hand-o-right" aria-hidden="true"></i> Interest
              Setup
            </h2>
            <div className="container">
              <div className="row">
                <div className="col-md-6">
                  <p>
                    <strong>Interest List</strong>
                  </p>
                </div>

                <div className="col-md-12">
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Order</th>
                          <th>Interest Type </th>
                          <th>Input Date</th>
                          <th>Active</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {interestList?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1} </td>
                            {item?.edit ? (
                              <>
                                <td>
                                  <input
                                    type="text"
                                    name="description"
                                    value={text}
                                    onChange={(e) => settext(e?.target?.value)}
                                  />
                                </td>
                                <td></td>
                                <td>
                                  <input
                                    type="checkbox"
                                    name="status"
                                    checked={editDesActive}
                                    id="active"
                                    onChange={(e) =>
                                      setEditDesActive(e?.target?.checked)
                                    }
                                  />
                                  {/* <span className="btn ">
                                      {item?.active ? "Yes" : "No"}
                                    </span> */}
                                </td>
                              </>
                            ) : (
                              <>
                                <td>{item.interest_type}</td>
                                <td>
                                  {getFormatedDate(
                                    item?.updated_at,
                                    "MM/DD/YYYY"
                                  )}
                                </td>
                                <td>{parseInt(item.active) ? "Yes" : "No"}</td>
                              </>
                            )}
                            <td>
                              {/* <button
                              className="btn btn-primary mx-1"
                              onClick={() =>
                                item?.edit
                                  ? updateFormData(item?.id, "InterestList")
                                  : editFieldData(
                                    item?.id,
                                    index,
                                    "InterestList"
                                  )
                              }
                            >
                              {" "}
                              Update{" "}
                            </button> */}

                              <button
                                className="btn btn-primary mx-1"
                                onClick={() =>
                                  item?.edit
                                    ? updateFormData(item?.id, "InterestList")
                                    : editFieldData(
                                        item?.id,
                                        index,
                                        "InterestList"
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
                                  deleteData(item.id, "InterestList")
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
                </div>
              </div>

              <div className="row">
                <div className="col-md-12">
                  <p>
                    <strong>Interest</strong>
                  </p>
                </div>
                <div className="col-md-6">
                  <div className="form-outline">
                    <textarea
                      value={interest}
                      className="form-control"
                      placeholder="Type here"
                      name="headerText"
                      onChange={(e) => setinterest(e.target.value)}
                    ></textarea>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="form-outline">
                    <label className="form-check-label">Active &nbsp;</label>
                    <input
                      type="checkbox"
                      checked={active}
                      id="active"
                      onChange={(e) => setactive(e.target.checked)}
                    />
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="text-right">
                    <button
                      id="btn1"
                      type="button"
                      className="btn btn btn-outline-primary align-bottom updateBtnSize"
                      onClick={() => updateData("section1")}
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
              <i className="fa fa-hand-o-right" aria-hidden="true"></i> Learn
              More
            </h2>
            <div className="container">
              <div className="row">
                <div className="container">
                  <label className="form-label-1" htmlFor="typeText">
                    Learn More Header
                  </label>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-outline">
                        <textarea
                          value={volText}
                          className="form-control"
                          placeholder="Type here"
                          name="headerText"
                          onChange={(e) => setVolText(e.target.value)}
                        ></textarea>
                      </div>

                      <br />

                      <div className="col-md-12">
                        <div className="text-right">
                          <button
                            type="button"
                            className="btn btn btn-outline-primary align-bottom updateBtnSize"
                            onClick={() => updateData("section2")}
                          >
                            Update Site
                          </button>
                        </div>
                      </div>
                      <br />
                    </div>
                  </div>
                </div>

                <div className="col-md-12">
                  <label className="form-label-1" htmlFor="typeText">
                    Learn More List
                  </label>
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Order</th>
                          <th>Name </th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Interest</th>
                          <th>Message</th>
                          <th>Date</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {learnMoreList?.map((item, key) => (
                          <tr key={key}>
                            {console.log("item", item)}
                            <td>{key + 1}</td>
                            <td>{item?.name}</td>

                            <td>{item?.email}</td>
                            <td>{item?.phone}</td>
                            <td>{item?.interest_type}</td>
                            <td>{item?.message}</td>
                            <td>
                              {getFormatedDate(item?.updated_at, "MM/DD/YYYY")}
                            </td>
                            <td>
                              <button
                                className="btn btn-secondary"
                                onClick={() =>
                                  deleteData(item.id, "LearnMoreList")
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
                  <div className="text-right">
                    <p>
                      <b>
                        Interested Total ={" "}
                        {learnMoreList?.length ? learnMoreList?.length : 0}
                      </b>
                    </p>
                  </div>
                </div>

                <div className="container">
                  <label className="form-label-1" htmlFor="typeText">
                    Interest Report:
                  </label>
                </div>

                <div className="container">
                  <div className="row">
                    <div className="col-md-4">
                      <label className="form-label-1"> Start Date </label>
                      <div className="form-group_1">
                        <DatePicker
                          selected={startDate}
                          onChange={(date) => setStartDate(date)}
                        />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label-1"> End Date </label>
                      <div className="form-group_1">
                        <DatePicker
                          selected={endDate}
                          onChange={(date) => setEndDate(date)}
                        />
                      </div>
                    </div>

                    <div className="col-md-4" style={{ marginTop: "auto" }}>
                      <div className="text-right">
                        <button
                          type="button"
                          className="btn align-bottom btn-success"
                          onClick={() => downloadLearnMoreData()}
                        >
                          Download Report{" "}
                          <i className="fa fa-download" aria-hidden="true"></i>
                        </button>
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
              Volunteer & Partner
            </h2>
            <div className="container">
              <div className="row">
                <div className="container">
                  <label className="form-label-1" htmlFor="typeText">
                    Volunteer Text
                  </label>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-outline">
                        <textarea
                          className="form-control reduceFont"
                          placeholder="Type here"
                          name="headerText"
                          value={volunteerText}
                          onChange={(e) => setVolunteerText(e.target.value)}
                        ></textarea>
                      </div>

                      <br />

                      <div className="col-md-12">
                        <div className="text-right">
                          <button
                            type="button"
                            className="btn btn btn-outline-primary align-bottom updateBtnSize"
                            onClick={() => updateData("section3")}
                          >
                            Update Site
                          </button>
                        </div>
                      </div>
                      <br />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="container">
              <div className="row">
                <div className="container">
                  <label className="form-label-1" htmlFor="typeText">
                    Partner Text
                  </label>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-outline">
                        <textarea
                          className="form-control reduceFont"
                          placeholder="Type here"
                          name="headerText"
                          value={partnerText}
                          onChange={(e) => setpartnerText(e.target.value)}
                        ></textarea>
                      </div>

                      <br />

                      <div className="col-md-12">
                        <div className="text-right">
                          <button
                            type="button"
                            className="btn btn btn-outline-primary align-bottom updateBtnSize"
                            onClick={() => updateData("section4")}
                          >
                            Update Site
                          </button>
                        </div>
                      </div>
                      <br />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="panel important">
            <h2>
              {" "}
              <i className="fa fa-hand-o-right" aria-hidden="true"></i> Sign Up
              Today
            </h2>
            <div className="container">
              <div className="row">
                <div className="col-md-6">
                  <p>
                    <Link href="">
                      {" "}
                      <strong>Sign Up List</strong>
                    </Link>
                  </p>
                </div>
                <div className="col-md-6 text-right">
                  <p>
                    {downloadLoader ? (
                      <Spinner
                        style={{ width: "50px", height: "50px", color: "#333" }}
                        animation="border"
                      />
                    ) : (
                      <Link href="#!">
                        <strong onClick={downloadSignupReport}>
                          Download List
                        </strong>
                      </Link>
                    )}
                  </p>
                </div>
                <div className="col-md-12">
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Count</th>
                          {/* <th>Name </th> */}
                          <th>Email</th>
                          {/* <th>City</th>
                        <th>State</th> */}
                          <th>Date</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {signUpList?.length &&
                          signUpList.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              {/* <td>{item?.name}</td> */}
                              {item?.edit ? (
                                <>
                                  <td>
                                    <input
                                      type="text"
                                      name="email"
                                      value={updateEmailSgnup}
                                      onChange={(e) =>
                                        setupdateEmailSgnup(e?.target?.value)
                                      }
                                    />
                                  </td>
                                </>
                              ) : (
                                <>
                                  <td>{item?.email}</td>
                                </>
                              )}
                              {/* <td>{item?.city}</td>
                          <td>{item?.state}</td> */}
                              <td>
                                {item?.updated_at
                                  ? getFormatedDate(
                                      item?.updated_at,
                                      "MM/DD/YYYY"
                                    )
                                  : ""}
                              </td>
                              <td>
                                <button
                                  className="btn btn-primary mx-1"
                                  onClick={() =>
                                    item?.edit
                                      ? updateFormData(item?.id, "SignupList")
                                      : editFieldData(
                                          item?.id,
                                          index,
                                          "SignupList"
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
                                    deleteData(item.id, "SignUpList")
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
                  <div className="text-right">
                    <p>
                      <b>Signup Total = {signUpList?.length}</b>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </AdminLayout>
    </>
  );
};

export default GetInvolved;
