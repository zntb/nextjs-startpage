import ParallaxVisualization from './parallax-visualization';
import { FOOTER_ITEMS } from '@/lib/constants';
import classes from './footer.module.css';

function Footer() {
  const d = new Date();
  const n = d.getFullYear();

  return (
    <>
      <footer className={classes.footer}>
        <ParallaxVisualization />

        <div>
          <ul>
            {FOOTER_ITEMS.map(item => (
              <li key={item.title}>
                <a href={item.url}>{item.title}</a>
              </li>
            ))}

            <li className={classes.copright}>
              &copy; 2016 -<span> {n}</span> zntb
            </li>
          </ul>
        </div>
      </footer>
    </>
  );
}

export default Footer;
