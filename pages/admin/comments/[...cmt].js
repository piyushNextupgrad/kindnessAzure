import AdminLayout from "@/layout/adminLayout";
import { Spinner } from "react-bootstrap";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { newsPageService } from "@/store/services/newsPageService";

const Comments = () => {
  const [sortedCommentsOfNews, setsortedCommentsOfNews] = useState([]);
  const [isSubmitingLoader, setIsSubmitingLoader] = useState(false);
  const [name, setname] = useState("");
  const router = useRouter();
  const { isReady } = useRouter();

  useEffect(() => {
    console.log("Router", router);
  }, []);

  useEffect(() => {
    if (isReady) {
      fetchComments(router.query?.cmt?.[1]);
      setname(router.query?.cmt?.[0]);
    }
  }, [router.query]);

  async function fetchComments(params) {
    setIsSubmitingLoader(true);
    try {
      const resp = await newsPageService.getComments(params);

      const sortedComments = resp.data.data.filter(
        (item) => item.post_id == params
      );
      console.log("sortedCommentsOfNews", sortedComments);
      //   setmanageCmtNotification(manageCmtNotification + 1);
      setsortedCommentsOfNews(sortedComments);
      setIsSubmitingLoader(false);
    } catch (error) {
      setIsSubmitingLoader(false);
      console.log(error);
    }
  }

  async function activateComment(id) {
    console.log(id);
    try {
      const formData = new FormData();
      formData.append("updateId", id);
      formData.append("status", "1");
      formData.append("secName", "news");
      const resp = await newsPageService.postComments(formData);
      if (resp.data.success == true) {
        fetchComments(router.query?.cmt?.[1]);
      }
    } catch (errro) {
      console.log(errro);
    }
  }
  async function deactivateComment(id) {
    setIsSubmitingLoader(true);
    try {
      const formData = new FormData();
      formData.append("updateId", id);
      formData.append("status", "0");
      formData.append("secName", "news");
      const resp = await newsPageService.postComments(formData);
      if (resp.data.success == true) {
        fetchComments(router.query?.cmt?.[1]);
        setIsSubmitingLoader(false);
      }
    } catch (errro) {
      setIsSubmitingLoader(false);
      console.log(errro);
    }
  }
  async function deleteComment(id) {
    setIsSubmitingLoader(true);
    try {
      const formData = new FormData();
      formData.append("delId", id);

      formData.append("secName", "news");
      const resp = await newsPageService.postComments(formData);
      if (resp.data.success == true) {
        fetchComments(router.query?.cmt?.[1]);
        setIsSubmitingLoader(false);
      }
    } catch (errro) {
      setIsSubmitingLoader(false);
      console.log(errro);
    }
  }

  return (
    <>
      <AdminLayout title={name}>
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
              <i
                className="fa fa-hand-o-right"
                aria-hidden="true"
                style={{ color: "#ff651f" }}
              />{" "}
              {name}-News Comments
            </h2>

            <section className="">
              <>
                {
                  <div style={{ display: "block" }}>
                    <div>
                      <div>
                        <div></div>
                        <div>
                          <div className="table-responsive">
                            <table className="table">
                              <tr style={{ backgroundColor: "#2b2d32" }}>
                                <th style={{ paddingLeft: "85px" }}>Name</th>
                                <th style={{ paddingLeft: "85px" }}>Email</th>
                                <th style={{ paddingLeft: "85px" }}>Comment</th>
                                <th style={{ paddingLeft: "85px" }}>Status</th>

                                <th>Action</th>
                              </tr>
                              {sortedCommentsOfNews.map((item, index) => (
                                <tr key={index}>
                                  <td>{item?.name}</td>
                                  <td>{item?.email_id}</td>
                                  <td>{item?.comment}</td>
                                  <td>
                                    {item?.status == "1"
                                      ? "Active"
                                      : "Inactive"}
                                  </td>
                                  <td>
                                    {item?.status == "1" ? (
                                      <button
                                        className="btn btn-secondary btn-sm"
                                        onClick={(e) =>
                                          deactivateComment(item?.id)
                                        }
                                      >
                                        Deactivate
                                      </button>
                                    ) : (
                                      <button
                                        className="btn btn-secondary btn-sm"
                                        onClick={(e) =>
                                          activateComment(item?.id)
                                        }
                                      >
                                        Activate
                                      </button>
                                    )}

                                    <button
                                      className="btn btn-sm btn-secondary mx-3"
                                      onClick={(e) => deleteComment(item?.id)}
                                    >
                                      Delete
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                }
              </>
            </section>
          </section>
        </main>
      </AdminLayout>
    </>
  );
};

export default Comments;
