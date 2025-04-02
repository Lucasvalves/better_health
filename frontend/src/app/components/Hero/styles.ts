import styled from 'styled-components';

export const Container = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.625rem;
  width: 100%;
  height: 90vh;
  background-color: var(--primary);
  > div {
    max-width: 1140px;
  }
  .welcome {
    display: block;
    font-family: 'caveat', sans-serif;;
  }
  .name {
    font-weight: 600;
    background-image: linear-gradient(
      90deg,
      rgba(9, 9, 121, 10) 0%,
      #0d52ff 50%,
      rgba(0, 212, 255, 1) 100%
    );
    color: black;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .lastName {
    color: var(--blue);
    font-weight: 400;
    margin-left: 0.5rem;
  }
  .center {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .icon {
    height: auto;
    margin-left: 1rem;
  }
  .icon:hover {
    transform: scale(1.1);
    transition: 0.5s;
  }
  .job {
    display: flex;
    font-weight: 400;
    align-items: center;
    gap: 0.8rem;
    font-size: 0.9rem;
  }
  .line {
    width: 1.5rem;
    height: 0.2rem;
    border-radius: 1rem;
    background-color: var(--blue);
  }
  @media (max-width: 359px) {
    font-size: 1.5rem;
    .welcome {
      text-align: center;
    }
    .job {
      font-size: 0.8rem;
    }
  }
  @media (min-width: 480px) and (max-width: 767px) {
    font-size: 2.52rem;
    .welcome {
    }
    .icon {
      width: 1.5rem;
    }
    .job {
      font-size: 1rem;
    }
    .line {
      width: 1.8rem;
    }
  }
  @media (min-width: 768px) {
    font-size: 3.52rem;
    .name,
    .welcome {
      margin-bottom: -30px;
    }
    .welcome {
    }
    .icon {
      width: 2rem;
    }
    .job {
      font-size: 1.25rem;
    }
    .line {
      width: 2.5rem;
    }
  }
`;
