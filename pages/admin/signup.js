import { useEffect, useState } from "react";
import { userServices } from "@/store/services/userServices";
import { Spinner } from "react-bootstrap";
import axios from "axios";
import showNotification from "@/helpers/show_notification";
import { useRouter } from "next/router";
import Link from "next/link";
const Signup = () => {
  const [isSubmittingLoader, setIsSubmittingLoader] = useState(false);
  const [msg, setMsg] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [fieldpassword, setPassword] = useState("");
  const [fieldconpassword, setConPassword] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [showPassword, setShowPassword] = useState(true);
  const router = useRouter();
  const signUpData = async () => {
    try {
      if (fieldconpassword === fieldpassword) {
        const response = await axios.post(
          `https://nextupgrad.com/kindness_project/api/register`,
          {
            name: name,
            email: email,
            password: fieldpassword,
            confirm_password: fieldconpassword,
          }
        );
        // console.log(response, "response");

        if (response?.data?.success) {
          showNotification(response?.data?.message, "Success");
          router.push("/admin");
        } else {
          showNotification(response?.data?.message, "Error");
        }
      } else {
        showNotification("Password not matched", "Error");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (fieldname, data) => {
    if (fieldname == "name") {
      setName(data?.target?.value);
    }
    if (fieldname == "email") {
      setEmail(data?.target?.value);
    }

    if (fieldname == "password") {
      setPassword(data?.target?.value);
    }

    if (fieldname == "conpassword") {
      setConPassword(data?.target?.value);
    }
  };

  return (
    <>
      <section>
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-2" />
            <div className="col-lg-6 col-md-8 login-box">
              <div className="col-lg-12 login-key">
                <img src="logo.webp" />
              </div>

              <div className="col-lg-12 login-title">TKC ADMIN PANEL</div>
              <div className="col-lg-12 login-title">SIGNUP</div>
              <div className="col-lg-12 login-form">
                <div className="col-lg-12 login-form">
                  <form name="signup">
                    <div className="form-group">
                      <label className="form-control-label">Name</label>
                      <input
                        type="email"
                        className="form-control"
                        onChange={(data) => handleChange("name", data)}
                        value={name}
                        name="user_name"
                        required
                      />
                    </div>
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

                    <div className="form-group">
                      <label className="form-control-label">
                        CONFIRM PASSWORD
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        onChange={(data) => handleChange("conpassword", data)}
                        value={fieldconpassword}
                        name="con_password"
                        required
                      />
                    </div>

                    <div className="col-lg-12 loginbttm">
                      <div className="col-lg-6 login-btm login-text">
                        {/* Error Message */}
                      </div>
                      <b>
                        {" "}
                        <Link href={"/admin"}>SIGNIN</Link>
                      </b>

                      <div className="col-lg-6 login-btm login-button">
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
                            onClick={signUpData}
                            className="btn btn-outline-primary"
                            style={{
                              fontSize: 15,
                              padding: "5px 20px",
                              color: "white",
                              fontWeight: 600,
                            }}
                          >
                            SIGNUP
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

export default Signup;
