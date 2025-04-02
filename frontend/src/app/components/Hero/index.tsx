import { Container } from './styles';
import TypeIt from 'typeit-react';
import {
  AiFillLinkedin,
  AiOutlineWhatsApp,
  AiFillGithub,
} from 'react-icons/ai';
import { motion } from 'framer-motion';
import {
  containerVariants,
  itemVariantsTitles,
  itemsVariantsEixoX,
} from '../../utils/constsAnimates';

export const Hero = () => {
  return (
    <Container id="hero">
      <motion.div
        className="grid-layout"
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
        }}
        variants={containerVariants}
      >
        <h1>
          <motion.span
            className="welcome"
            variants={itemVariantsTitles}
            transition={{
              duration: 2,
            }}
          >
            Olá, bem vindo(a)! sou o
          </motion.span>
          <span className="center">
            <motion.span
              className="name"
              variants={itemVariantsTitles}
              transition={{
                duration: 2,
              }}
            >
              <TypeIt
                options={{
                  strings: ['Lucas Veloso'],
                  speed: 350,
                  waitUntilVisible: true,
                }}
              ></TypeIt>
            </motion.span>
          </span>
        </h1>
        <motion.span
          className="center"
          variants={itemVariantsTitles}
          transition={{
            duration: 2,
          }}
        >
          <motion.a
            href="https://wa.me/5571996579989"
            target="blank"
            variants={itemsVariantsEixoX}
            transition={{
              duration: 4,
            }}
          >
            <AiOutlineWhatsApp className="icon" />
          </motion.a>
          <motion.a
            href="https://www.linkedin.com/in/lucasvelosoalves/"
            target="blank"
            variants={itemsVariantsEixoX}
            transition={{
              duration: 5,
            }}
          >
            <AiFillLinkedin className="icon" />
          </motion.a>
          <motion.a
            href="https://github.com/Lucasvalves"
            target="blank"
            variants={itemsVariantsEixoX}
            transition={{
              duration: 6,
            }}
          >
            <AiFillGithub className="icon" />
          </motion.a>
        </motion.span>
        <motion.span
          className="center job"
          variants={itemVariantsTitles}
          transition={{
            duration: 2,
          }}
        >
          <div className="line"></div>
          <h2 className="job">Desenvolvedor Front-end</h2>
        </motion.span>
      </motion.div>
    </Container>
  );
};
