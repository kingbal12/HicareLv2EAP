import React from "react";
import themeConfig from "../configs/themeConfig";
import classnames from "classnames";
import PerfectScrollbar from "perfect-scrollbar";

const FullPageLayout = ({ children, ...rest }) => {
  return (
    <div
      className={classnames(
        // bg-full-screen-image 디폴트 배경화면
        "full-layout wrapper bg-white  blank-page dark-layout",
        {
          "layout-dark": themeConfig.layoutDark,
        }
      )}
    >
      <div className="app-content">
        <div className="content-wrapper">
          <div className="content-body">
            <div className="flexbox-container" style={{ overflow: "scroll" }}>
              {/* <PerfectScrollbar> */}
              <main className="main w-100">{children}</main>
              {/* </PerfectScrollbar> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullPageLayout;
