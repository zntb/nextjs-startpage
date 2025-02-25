import BackgroundImage from '@/components/background-image/background-image';
import Clock from '@/components/clock-widget/clock';
import Dropdown from '@/components/dropdown-menus/dropdown';
import Exchange from '@/components/exchange-widget/exchange';
import MainHeader from '@/components/header/main-header';
import SearchBar from '@/components/search/search';
import Weather from '@/components/weather-widget/weather';
import Footer from '@/components/footer/footer';
import classes from './page.module.css';

import { getDropdownLinks } from '@/lib/actions';
import { Category } from '@/lib/actions';

export default async function StartMenu() {
  const categories: Category[] = await getDropdownLinks(); // Fetch data on the server side

  return (
    <>
      <BackgroundImage />
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
