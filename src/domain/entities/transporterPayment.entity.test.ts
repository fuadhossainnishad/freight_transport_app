import {
  canRequestPayment,
  findPendingRequestFor,
  mapTransporterPayment,
} from './transporterPayment.entity';

// Decides whether the screen offers the "Request Payment" button, mirroring
// ActiveShipmentDetailsScreen: showRequestPayment = paymentEligible && !pending.
const wouldShowButton = (role: string, status: string, payments: any[], shipmentId: string) => {
  const eligible = role === 'TRANSPORTER' && canRequestPayment(status);
  const pending = findPendingRequestFor(payments.map(mapTransporterPayment), shipmentId);
  return eligible && !pending;
};

const payment = (shipmentId: string, status: string) => ({
  _id: 'pay_' + shipmentId,
  shipment_id: shipmentId,
  status,
  amount: 10000,
  payment_method: 'online',
});

describe('Request Payment button visibility', () => {
  it('is hidden when a pending request already exists (the 409 case)', () => {
    // Reproduces APP-TEST 1: IN_PROGRESS, but already has a pending request.
    expect(wouldShowButton('TRANSPORTER', 'IN_PROGRESS', [payment('s1', 'pending')], 's1')).toBe(false);
  });

  it('is hidden while an online request is still processing', () => {
    expect(wouldShowButton('TRANSPORTER', 'IN_PROGRESS', [payment('s1', 'online_processing')], 's1')).toBe(false);
  });

  it('is shown when the shipment has no request at all', () => {
    // Reproduces "asdfasdf": IN_PROGRESS, no request -> would succeed.
    expect(wouldShowButton('TRANSPORTER', 'IN_PROGRESS', [], 's1')).toBe(true);
  });

  it('is shown for a COMPLETED shipment with no request', () => {
    // Reproduces "Test Map App 3".
    expect(wouldShowButton('TRANSPORTER', 'COMPLETED', [], 's1')).toBe(true);
  });

  it('is shown again once a previous request was rejected', () => {
    // A rejected request no longer blocks — the backend only checks `pending`.
    expect(wouldShowButton('TRANSPORTER', 'IN_PROGRESS', [payment('s1', 'rejected')], 's1')).toBe(true);
  });

  it('is shown again once a previous request was paid', () => {
    expect(wouldShowButton('TRANSPORTER', 'IN_PROGRESS', [payment('s1', 'paid')], 's1')).toBe(true);
  });

  it('is not confused by a pending request on a different shipment', () => {
    expect(wouldShowButton('TRANSPORTER', 'IN_PROGRESS', [payment('other', 'pending')], 's1')).toBe(true);
  });

  it('is hidden for IN_TRANSIT, which the backend rejects', () => {
    // Reproduces "Test Shipment For Price".
    expect(wouldShowButton('TRANSPORTER', 'IN_TRANSIT', [], 's1')).toBe(false);
  });

  it('is hidden for a shipper, since the route is transporter-only', () => {
    expect(wouldShowButton('SHIPPER', 'IN_PROGRESS', [], 's1')).toBe(false);
  });
});

describe('mapTransporterPayment', () => {
  it('reads the shipment id when the API returns it populated', () => {
    // /my-requests populates shipment_id; the create response returns a string.
    const p = mapTransporterPayment({
      _id: 'p1',
      shipment_id: { _id: 's1', shipment_title: 'APP-TEST 1' },
      status: 'pending',
      amount: 10000,
      payment_method: 'online',
    });
    expect(p.shipmentId).toBe('s1');
  });

  it('matches a populated request against a shipment id', () => {
    const payments = [
      {
        _id: 'p1',
        shipment_id: { _id: 's1', shipment_title: 'APP-TEST 1' },
        status: 'pending',
        amount: 10000,
        payment_method: 'online',
      },
    ];
    expect(wouldShowButton('TRANSPORTER', 'IN_PROGRESS', payments, 's1')).toBe(false);
  });
});
