import styled from "styled-components";
import Header from "../../Components/Common/Header";
import AddedAndParty from "./AddedAndParty";
const Chalani = () => {
    return (
        <div className="mainContainer">
            <Header title={'Chalani'}></Header>
            {/* <div className="mainContainer"> */}
            {/* <ClientAndUser> */}
                <AddedAndParty />
            {/* </ClientAndUser> */}

            {/* </div> */}

        </div>
    )
}


export default Chalani;




const ClientAndUser = styled.div`
display: flex;
flex-direction: row;
justify-content: flex-start;
background-color: white;



`
