import styled from "styled-components";

function Message() {
    return (
        <Container>
            <p>{message}</p>
        </Container>
    )
}

export default Message;

const Container = styled.div``;