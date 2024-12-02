import PageWrapper from "src/components/PageWrapper";  
import './CardPage.css';  
  
const CardPage = () => (  
  <PageWrapper title="CardPage">  
   <div className="user-card">  
    <div className="card-header">  
      <h2>Test</h2>  
      <p>Aura Points: 60</p>  
    </div>  
  
    {/* <div className="card-image">  
      <img src="user.png" alt="User" />  

    </div>   */}

    <div className="card-image">
      <p>image here</p>
    </div>
  
    <div className="card-description">  
      <p>Rank: "input rank"</p>  
      <p>Could put the latest completed challenges here.</p>  
    </div>  
   </div>  
  </PageWrapper>  
);  
  
export default CardPage;
