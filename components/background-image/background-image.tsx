import Image from 'next/image';

import backgroundImg from '@/assets/images/background.jpg';
import classes from './background-image.module.css';

function BackgroundImage() {
  return (
    <div className={classes.backgroundImg}>
      <Image
        src={backgroundImg}
        alt='background'
        width={1920}
        height={1080}
        priority
      />
    </div>
  );
}

export default BackgroundImage;
