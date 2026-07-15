import { formatPriceRange } from './format-price.helper';

// Mirrors the price mapping in useDriverShipments.mapApiShipment, so these
// cases exercise the same path the driver's shipment cards take.
const mapPrice = (s: any) => ({ priceMin: s.price ?? null, priceMax: s.price ?? null });
const render = (s: any) => {
  const { priceMin, priceMax } = mapPrice(s);
  return formatPriceRange(priceMin, priceMax);
};

describe('formatPriceRange', () => {
  describe('a shipment with no agreed price', () => {
    // These are the cards that were rendering "$0".
    it('renders "—" when the API omits price entirely', () => {
      expect(render({})).toBe('—');
    });

    it('renders "—" when price is null', () => {
      expect(render({ price: null })).toBe('—');
    });

    it('renders "—" when price is undefined', () => {
      expect(render({ price: undefined })).toBe('—');
    });

    it('renders "—" when price is an empty string', () => {
      expect(render({ price: '' })).toBe('—');
    });

    it('renders "—" when price is unparseable', () => {
      expect(render({ price: 'abc' })).toBe('—');
    });
  });

  describe('a shipment with a real price', () => {
    it('renders a priced shipment unchanged', () => {
      expect(render({ price: 3000 })).toBe('$3,000');
    });

    it('parses a numeric string, as some endpoints return', () => {
      expect(render({ price: '3000' })).toBe('$3,000');
    });

    // A real zero quote is distinct from "no price yet" and must still show.
    it('renders a genuine zero price as $0, not "—"', () => {
      expect(render({ price: 0 })).toBe('$0');
    });
  });

  describe('ranges', () => {
    it('renders distinct bounds as a range', () => {
      expect(formatPriceRange(1200, 1300)).toBe('$1,200 - $1,300');
    });

    it('renders equal bounds once', () => {
      expect(formatPriceRange(2500, 2500)).toBe('$2,500');
    });

    it('renders a single price when only the max is known', () => {
      expect(formatPriceRange(null, 1300)).toBe('$1,300');
    });

    it('renders a single price when only the min is known', () => {
      expect(formatPriceRange(1200, null)).toBe('$1,200');
    });
  });
});
