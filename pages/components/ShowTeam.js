import { getFormatedDate } from "@/store/library/utils";
import { imageConfigDefault } from "next/dist/shared/lib/image-config";

const TeamModal = (props) => {
  return (
    <>
      {props?.toggle && (
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
                      <th>Preview</th>
                      <th>Name</th>
                      <th>OverView</th>
                    </tr>
                  </thead>
                  <tbody>
                    {props.meetExeutive?.length
                      ? props.meetExeutive.map((item, index) => {
                          if (item.active == "1") {
                            return (
                              <tr key={item?.id + index}>
                                <td>
                                  <img
                                    className="listImgPreview"
                                    src={
                                      process.env.NEXT_PUBLIC_SITE_URL +
                                      item?.media
                                    }
                                  ></img>
                                </td>
                                <td className="nameWidthIncrease">
                                  {item?.column_1} {item?.column_2}
                                </td>
                                <td className="fixLineHeight">
                                  {item?.description}
                                </td>
                              </tr>
                            );
                          }
                        })
                      : ""}
                  </tbody>
                </table>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={props.closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {props?.toggle && <div className="modal-backdrop fade show"></div>}
    </>
  );
};

export default TeamModal;
