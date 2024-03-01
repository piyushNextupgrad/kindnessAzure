import { newsPageService } from "../../store/services/newsPageService";
const CommentModal = ({
  checker,
  setChecker,
  News_title,
  sortedCommentsOfNews,
  fetchComments,
  News_ID,
}) => {
  function closePopup() {
    setChecker(false);
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
        fetchComments(News_ID, News_title);
      }
    } catch (errro) {
      console.log(errro);
    }
  }
  async function deactivateComment(id) {
    console.log(id);
    try {
      const formData = new FormData();
      formData.append("updateId", id);
      formData.append("status", "0");
      formData.append("secName", "news");
      const resp = await newsPageService.postComments(formData);
      if (resp.data.success == true) {
        fetchComments(News_ID, News_title);
      }
    } catch (errro) {
      console.log(errro);
    }
  }
  async function deleteComment(id) {
    console.log(id);
    try {
      const formData = new FormData();
      formData.append("delId", id);

      formData.append("secName", "news");
      const resp = await newsPageService.postComments(formData);
      if (resp.data.success == true) {
        fetchComments(News_ID, News_title);
      }
    } catch (errro) {
      console.log(errro);
    }
  }
  return (
    <>
      {checker && (
        <div
          className="modal fade show"
          tabIndex="-1"
          style={{ display: "block" }}
        >
          <div className="modal-dialog modal-dialog-scrollable modal-lg modal-fullscreen-lg-down ">
            <div className="modal-content">
              <div className="modal-header">
                <h3 className="modal-title fs-5 popupHeading">
                  {News_title} - comments
                </h3>
              </div>
              <div className="modal-body">
                <table>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Comment</th>
                    <th>Status</th>

                    <th>Action</th>
                  </tr>
                  {sortedCommentsOfNews.map((item, index) => (
                    <tr key={index}>
                      <td>{item?.name}</td>
                      <td>{item?.email_id}</td>
                      <td>{item?.comment}</td>
                      <td>{item?.status == "1" ? "Active" : "Inactive"}</td>
                      <td>
                        {item?.status == "1" ? (
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={(e) => deactivateComment(item?.id)}
                          >
                            Deactivate
                          </button>
                        ) : (
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={(e) => activateComment(item?.id)}
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
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary btn"
                  onClick={closePopup}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {checker && <div className="modal-backdrop fade show"></div>}
    </>
  );
};

export default CommentModal;
