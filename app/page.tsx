import Clock from '@/components/clock-widget/clock';
import Dropdown from '@/components/dropdown-menus/dropdown';
import Exchange from '@/components/exchange-widget/exchange';
import MainHeader from '@/components/header/main-header';
import SearchBar from '@/components/search/search';
import Weather from '@/components/weather-widget/weather';
import Footer from '@/components/footer/footer';
import classes from './page.module.css';

import { getDropdownLinks } from '@/lib/actions/dropdown';
import { Category } from '@/lib/actions/dropdown';
import { DROPDOWN_CONTENT } from '@/lib/constants';
import crypto from 'crypto';

export default async function StartPage() {
  let categories: Category[] = await getDropdownLinks();

  // If no data is found, use local fallback data
  if (categories.length === 0) {
    categories = DROPDOWN_CONTENT.map(item => ({
      id: crypto.randomUUID(),
      name: item.category,
      links: item.links.map(link => ({
        id: crypto.randomUUID(),
        title: link.title,
        url: link.url,
        order: 0,
      })),
    }));
  }

  return (
    <>
      <div className={classes.backgroundImg} id='dynamic-bg' />
      <MainHeader />
      <main className={classes.main}>
        <section className={classes.topSection}>
          <Weather />
          <Clock />
          <Exchange />
        </section>
        <section className={classes.centerSection}>
          <div className={classes.gridContent}>
            <SearchBar />
            <Dropdown categories={categories} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
