'use client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';
import classes from './search.module.css';

const duckduckgo = 'https://duckduckgo.com/?q=';

export default function Search() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState<string>('');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (searchValue.trim() !== '') {
      router.push(`${duckduckgo}${searchValue}`);
    }
  }

  function onClear() {
    setSearchValue('');
  }

  return (
    <div className={classes.container}>
      <form className={classes.search} onSubmit={handleSubmit}>
        <input
          id="searchInput"
          type="text"
          placeholder="Keresés DuckDuckGo..."
          className={classes.searchInput}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <div className={classes.buttons}>
          {searchValue && (
            <button
              className={classes.closeButton}
              onClick={onClear}
              type="button"
            >
              <Image
                src="/icons/close.svg"
                alt="close icon"
                width={20}
                height={20}
                priority
              />
            </button>
          )}
          <button className={classes.searchButton} type="submit">
            <Image
              src="/icons/loupe.svg"
              alt="loupe icon"
              width={20}
              height={20}
              priority
            />
          </button>
        </div>
      </form>
    </div>
  );
}
