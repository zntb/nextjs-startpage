import classes from './dropdown.module.css';
import { Raleway } from 'next/font/google';

const raleway = Raleway({
  weight: ['500'],
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap',
});

type DropdownContentProps = {
  category: string;
  links: { title: string; url: string }[];
};

function DropdownContent({ category, links }: DropdownContentProps) {
  return (
    <div className={`${classes.dropdown} ${raleway.className}`}>
      <button className={classes.dropbtn}>{category}</button>
      <div className={classes.dropdownContent}>
        {links.map((link, id) => (
          <a key={id} href={link.url}>
            {link.title}
          </a>
        ))}
      </div>
    </div>
  );
}

export default DropdownContent;
