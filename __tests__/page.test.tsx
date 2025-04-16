/* eslint-disable react/display-name */
import { render, screen } from '@testing-library/react';
import StartPage from '@/app/page';
import { getDropdownLinks } from '@/lib/actions/dropdown';
import { DROPDOWN_CONTENT } from '@/lib/constants';

jest.mock('@/lib/actions/dropdown', () => ({
  getDropdownLinks: jest.fn(),
}));

jest.mock('crypto', () => ({
  randomUUID: () => 'mocked-uuid',
}));

jest.mock('@/components/clock-widget/clock', () => () => <div>Clock</div>);
jest.mock('@/components/exchange-widget/exchange', () => () => (
  <div>Exchange</div>
));
jest.mock('@/components/header/main-header', () => () => <div>MainHeader</div>);
jest.mock('@/components/search/search', () => () => <div>SearchBar</div>);
jest.mock('@/components/weather-widget/weather', () => () => (
  <div>Weather</div>
));
jest.mock('@/components/footer/footer', () => () => <div>Footer</div>);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
jest.mock('@/components/dropdown-menus/dropdown', () => (props: any) => (
  <div>Dropdown with {props.categories.length} categories</div>
));

describe('StartPage', () => {
  it('renders with fetched categories', async () => {
    const mockCategories = [
      {
        id: 'cat1',
        name: 'Test Category',
        links: [
          { id: 'link1', title: 'Google', url: 'https://google.com', order: 0 },
        ],
      },
    ];
    (getDropdownLinks as jest.Mock).mockResolvedValueOnce(mockCategories);

    render(await StartPage());

    expect(screen.getByText('MainHeader')).toBeInTheDocument();
    expect(screen.getByText('Weather')).toBeInTheDocument();
    expect(screen.getByText('Clock')).toBeInTheDocument();
    expect(screen.getByText('Exchange')).toBeInTheDocument();
    expect(screen.getByText('SearchBar')).toBeInTheDocument();
    expect(screen.getByText(/Dropdown with 1 categories/)).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('falls back to local content if no categories fetched', async () => {
    (getDropdownLinks as jest.Mock).mockResolvedValueOnce([]);

    render(await StartPage());

    expect(
      screen.getByText(`Dropdown with ${DROPDOWN_CONTENT.length} categories`),
    ).toBeInTheDocument();
  });
});
