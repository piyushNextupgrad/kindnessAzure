import { getFormatedDate } from "@/store/library/utils";
import { imageConfigDefault } from "next/dist/shared/lib/image-config";
import { BsYoutube, BsFileEarmarkImage } from "react-icons/bs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import showNotification from "@/helpers/show_notification";

const NewsModal = ({
  updateFormData,
  editFieldData,
  toggleNewsModal,
  settoggleNewsModal,
  text1,
  settext1,
  toggleNewsYT,
  settoggleNewsYT,
  updateDate,
  setupdateDate,
  updateCampSection,
  setUpdateCampSection,
  featuredActive,
  setFeaturedActive,
  updateActive,
  setUpdateActive,
  newsupdateYTdata,
  setnewsupdateYTdata,
  showVideo,
  setupdateFile,
  setNewsSectionData,
  newsSectionData,
  setNewsSectionDataBackup,
  newsSectionDataBackup,
  closePopup,
  newsid,
  deleteData,
}) => {
  return (
    <>
      {toggleNewsModal && (
        <div
          className="modal fade show "
          tabIndex="-1"
          style={{ display: "block" }}
        >
          <div className="modal-dialog modal-dialog-scrollable modal-xl modal-sm model ">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5"></h1>
              </div>
              <div className="modal-body customBody">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Media Type </th>
                      <th style={{ minWidth: "120px" }}>Expire Date</th>
                      <th>Description</th>
                      <th>Featured</th>
                      <th>Active</th>

                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody className="popupFontFix">
                    <>
                      <td>
                        <input
                          type="text"
                          name="title"
                          value={text1}
                          onChange={(e) => settext1(e?.target?.value)}
                        />
                      </td>
                      <td className="popupMediaFix">
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
                                  const inputValue = e.target.value.trim();
                                  setnewsupdateYTdata(inputValue);
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
                                const img = e?.target?.files[0];

                                const fileName = img.name.toLowerCase();

                                if (
                                  /\.(tiff|eps|avi|wmv|bmp|flv)$/.test(fileName)
                                ) {
                                  e.target.value = null;
                                  showNotification(
                                    "File format not supported.",
                                    "Error"
                                  );
                                  return;
                                }
                                if (
                                  /\.(jpg|jpeg|png|gif|webp|)$/.test(fileName)
                                ) {
                                  if (img.size > 6 * 1024 * 1024) {
                                    e.target.value = null;
                                    showNotification(
                                      "Image size exceeds 6MB. Please choose a smaller image.",
                                      "Error"
                                    );
                                  } else {
                                    setupdateFile(e.target.files[0]);
                                  }
                                } else if (
                                  /\.(mp4|mov|mkv||Ff4v|swf|webm)$/.test(
                                    fileName
                                  )
                                ) {
                                  if (img.size > 100 * 1024 * 1024) {
                                    e.target.value = null;
                                    showNotification(
                                      "Video size exceeds 100MB. Please choose a smaller video.",
                                      "Error"
                                    );
                                  } else {
                                    setupdateFile(e.target.files[0]);
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
                            <div style={{ width: "100%" }} className="popupYT">
                              <span
                                className="mx-4 custom-youtube-toggleLink"
                                onClick={() => {
                                  toggleNewsYT
                                    ? settoggleNewsYT(false)
                                    : settoggleNewsYT(true);
                                }}
                              >
                                <BsYoutube id="youTubelogoPopup" />
                                YouTube Link
                              </span>
                            </div>
                          </>
                        )}
                      </td>
                      <td>
                        <DatePicker
                          value={updateDate}
                          onChange={(date) =>
                            setupdateDate(getFormatedDate(date, "YYYY-MM-DD"))
                          }
                          dateFormat="MMMM d, yyyy h:mm aa"
                        />
                      </td>
                      <td>
                        <textarea
                          style={{ height: "200px", width: "300px" }}
                          className="form-control "
                          placeholder="Type here"
                          id="floatingTextarea"
                          value={updateCampSection}
                          onChange={(e) =>
                            setUpdateCampSection(e?.target?.value)
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
                            setFeaturedActive(e?.target?.checked)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          name="status"
                          id="active"
                          checked={updateActive}
                          onChange={(e) => setUpdateActive(e?.target?.checked)}
                        />
                      </td>
                      <td>
                        <button
                          className="btn btn-primary mx-1"
                          onClick={() => updateFormData(newsid, "CampNews")}
                        >
                          <i className="fa fa-floppy-o" aria-hidden="true" />
                        </button>

                        <button
                          className="btn btn-secondary"
                          onClick={() => deleteData(newsid, "CampaignNews")}
                        >
                          <i className="fa fa-trash-o" aria-hidden="true" />
                        </button>
                      </td>
                    </>
                  </tbody>
                </table>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={closePopup}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toggleNewsModal && <div className="modal-backdrop fade show"></div>}
    </>
  );
};

export default NewsModal;
