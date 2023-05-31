import React from "react";
import withProvider from "../../hoc/WithProvider";

const Index = () => {
  return (
    <div>
      {/* <!-- Page Heading --> */}
      <section className="position-relative sub_page_title bg_light_blue">
        <div className="container">
          <div className="row">
            <div className="col col-12">
              <div className="position-relative text-center pb-3">
                <h2>
                  WEBSITE <span className="text-capitalize">DISCLAIMER</span>
                </h2>
                <p>
                  The information provided by <b>KYM Global</b> "we," "us," or
                  "our" on{" "}
                  <a href="http://www.kymgl.com" target="_blank">
                    http://www.kymgl.com
                  </a>{" "}
                  Site is for general informational purposes only.{" "}
                </p>
                <p>
                  All information on is provided in good faith, however we make
                  no representation or warranty of any kind, express or implied,
                  regarding the accuracy, adequacy, validity, reliability,
                  availability, or completeness of any information on
                </p>
                <p>
                  <b>
                    UNDER NO CIRCUMSTANCE SHALL WE HAVE ANY LIABILITY TO YOU FOR
                    ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE
                    USE OF THE SITE OR RELIANCE ON ANY INFORMATION PROVIDED ON
                    THE SITE YOUR USE OF THE SITE AND YOUR RELIANCE ON ANY
                    INFORMATION ON THE SITE IS SOLELY AT YOUR OWN RISK.
                  </b>
                </p>
                <p><b>EXTERNAL LINKS DISCLAIMER</b> </p>
                <p>The Site may contain (or you may be sent through</p>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col col-12">
              <div className="position-relative info_page">
                <p></p>
                <p>
                  to other websites or content belonging to or originating from
                  third parties or links to websites and features in banners or
                  other advertising. Such external links are not investigated,
                  monitored, or checked for accuracy, adequacy, validity,
                  reliability, availability, or completeness by us.
                </p>
                <p>
                  WE DO NOT WARRANT, ENDORSE, GUARANTEE, OR ASSUME
                  RESPONSIBILITY FOR THE ACCURACY OR RELIABILITY OF ANY
                  INFORMATION OFFERED BY THIRD-PARTY WEBSITES LINKED THROUGH THE
                  SITE OR ANY WEBSITE OR FEATURE LINKED IN ANY BANNER OR OTHER
                  ADVERTISING. WE WILL NOT BE A PARTY TO OR IN ANY WAY BE
                  RESPONSIBLE FOR MONITORING ANY TRANSACTION BETWEEN YOU AND
                  THIRD-PARTY PROVIDERS OF PRODUCTS OR SERVICES.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default withProvider(Index);
