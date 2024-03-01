import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { APPCONST } from "@/store/constant/globalVar";
import { userServices } from "@/store/services/userServices";
import { userDetailsAction } from "@/store/actions/User/UserSlice";
import { emailValidation } from "@/store/library/utils";
import Image from "next/image";

const Login = () => {
  let dispatch = useDispatch();
  const userData = useSelector((state) => state);
  const [isSubmittingLoader, setIsSubmittingLoader] = useState(false);
  const [msg, setMsg] = useState("");
  const [email, setEmail] = useState("");
  const [fieldpassword, setPassword] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [showPassword, setShowPassword] = useState(true);

  const router = useRouter();

  useEffect(() => {
    if (localStorage != undefined) {
      let item = localStorage?.getItem(APPCONST.AccessToken);
      if (item != undefined) {
        router.push("/admin/home");
      }
    }
  }, []);

  const signInData = async () => {
    try {
      if (email != "" && emailValidation(email) && fieldpassword != "") {
        let formData = new FormData();
        setIsSubmittingLoader(true);
        formData.append("email", email);
        formData.append("password", fieldpassword);

        const getResponse = await userServices.login(formData);

        if (getResponse?.data?.success) {
          localStorage.setItem(
            APPCONST.AccessToken,
            getResponse?.data?.data?.token
          );

          let responseData = getResponse?.data?.data?.name;
          dispatch(userDetailsAction.userDetailsData(responseData));

          setIsSubmittingLoader(false);
          router.push("/admin/home");
        } else {
          setResponseStatus(getResponse?.data?.success);
          setMsg(getResponse?.data?.message);
          setIsSubmittingLoader(false);
        }
      } else {
        setMsg("Email and password is required");
        setIsSubmittingLoader(false);
      }
    } catch (e) {
      if (e && e.error && e.error.message) {
        setMsg(e.error.message);
      }
      setIsSubmittingLoader(false);
    }
  };

  const handleChange = (fieldname, data) => {
    if (fieldname == "email") {
      setEmail(data?.target?.value);
    }

    if (fieldname == "password") {
      setPassword(data?.target?.value);
    }
  };

  return (
    <>
      <section className="login-background">
        <div className="container">
          <div id="centerForm" className="row ">
            <div className="col-lg-6 col-md-8 login-box">
              <div className="col-lg-12 login-key">
                <Image src="../logo.webp" width={150} height={100} alt="Logo" />
              </div>

              <div className="col-lg-12 login-title">TKC ADMIN PANEL</div>
              <div className="col-lg-12 login-form">
                <div className="col-lg-12 login-form">
                  <form name="login">
                    <div className="form-group">
                      <label className="form-control-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        onChange={(data) => handleChange("email", data)}
                        value={email}
                        name="user_email"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-control-label">PASSWORD</label>
                      <input
                        type="password"
                        className="form-control"
                        onChange={(data) => handleChange("password", data)}
                        value={fieldpassword}
                        name="password"
                        required
                      />
                    </div>

                    <div className="col-lg-12 loginbttm">
                      <div className="col-lg-12 login-btm login-button">
                        {isSubmittingLoader ? (
                          <Spinner
                            style={{
                              width: "20px",
                              height: "20px",
                              color: "#fff",
                            }}
                            animation="border"
                          />
                        ) : (
                          <button
                            type="button"
                            onClick={signInData}
                            className="btn btn-outline-primary login-btn-1"
                          >
                            LOGIN
                          </button>
                        )}
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className="col-lg-3 col-md-2" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
