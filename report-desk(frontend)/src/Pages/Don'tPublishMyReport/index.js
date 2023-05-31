import React from 'react'
import withProvider from '../../hoc/WithProvider'

const Index = () => {
  return (
    <div>
         {/* <!-- Page Heading --> */}
     <section className="position-relative sub_page_title bg_light_blue">
          <div className="container">
               <div className="row">
                    <div className="col col-12">
                         <div className="position-relative text-center pb-3">
                              <h2>Don't Publish <span className="text-capitalize">My Report</span></h2>
                              <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit.</p>
                         </div>
                    </div>
               </div>

               <div className="row">
                    <div className="col col-12">
                         <div className="position-relative info_page">
                              <p><b>Lorem ipsum, dolor sit amet.</b></p>
                              <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Omnis quasi, hic totam fuga reiciendis placeat! Perferendis ullam excepturi laborum libero obcaecati unde, culpa, quis numquam sit dolor voluptates ex nemo!</p>
                              <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Omnis quasi, hic totam fuga reiciendis placeat! Perferendis ullam excepturi laborum libero obcaecati unde, culpa, quis numquam sit dolor voluptates ex nemo!. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Omnis quasi, hic totam fuga reiciendis placeat! Perferendis ullam excepturi laborum libero obcaecati unde, culpa, quis numquam sit dolor voluptates ex nemo!. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Omnis quasi, hic totam fuga reiciendis placeat! Perferendis ullam excepturi laborum libero obcaecati unde, culpa, quis numquam sit dolor voluptates ex nemo!</p>
                         
                              <ul>
                                   <li>Lorem ipsum, dolor sit amet consectetur adipisicing elit.</li>
                                   <li>Lorem ipsum, dolor sit amet consectetur adipisicing elit.</li>
                                   <li>Lorem ipsum, dolor sit amet consectetur adipisicing elit.</li>
                                   <li>Lorem ipsum, dolor sit amet consectetur adipisicing elit.</li>
                                   <li>Lorem ipsum, dolor sit amet consectetur adipisicing elit.</li>
                                   <li>Lorem ipsum, dolor sit amet consectetur adipisicing elit.</li>
                              </ul>

                              <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Omnis quasi, hic totam fuga reiciendis placeat! Perferendis ullam excepturi laborum libero obcaecati unde, culpa, quis numquam sit dolor voluptates ex nemo!. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Omnis quasi, hic totam fuga reiciendis placeat! Perferendis ullam excepturi laborum libero obcaecati unde, culpa, quis numquam sit dolor voluptates ex nemo!. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Omnis quasi, hic totam fuga reiciendis placeat! Perferendis ullam excepturi laborum libero obcaecati unde, culpa, quis numquam sit dolor voluptates ex nemo!</p>

                         </div>
                    </div>
               </div>

          </div>
     </section>
    </div>
  )
}

export default withProvider(Index)