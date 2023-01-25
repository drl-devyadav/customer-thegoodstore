import InfoCard, { InfoField } from 'components/commercetools-ui/organisms/account/account-atoms/info-card';
import { useFormat } from 'helpers/hooks/useFormat';
import { useAccount } from 'frontastic';
import { AccountWithSubscription } from '../forms/subscribe-form';

const Newsletter = () => {
  const { formatMessage } = useFormat({ name: 'account' });
  const { account } = useAccount();

  const subscribed = formatMessage({ id: 'subscribe', defaultMessage: 'Yes, I want to subscribe.' });
  const unsubscribed = formatMessage({ id: 'unsubscribe', defaultMessage: 'No, I do not wish to receive emails.' });

  const subscriptionField: InfoField = {
    label: formatMessage({ id: 'subscription', defaultMessage: 'Subscription' }),
    value: (account as AccountWithSubscription)?.isSubscribed ? subscribed : unsubscribed,
  };
  return <InfoCard isEditable title="Newsletter" infoFields={[subscriptionField]} editHref="#edit-newsletter" />;
};

export default Newsletter;
