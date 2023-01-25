import { useState } from 'react';
import { Account } from '@commercetools/frontend-domain-types/account/Account';
import Typography from 'components/commercetools-ui/atoms/typography';
import AccountForm from 'components/commercetools-ui/organisms/account/account-atoms/account-form';
import useFeedbackToasts from 'components/commercetools-ui/organisms/account/hooks/useFeedbackToasts';
import useDiscardForm from 'components/commercetools-ui/organisms/account/useDiscardForm';
import { useFormat } from 'helpers/hooks/useFormat';
import { useAccount } from 'frontastic';

export interface AccountWithSubscription extends Account {
  isSubscribed?: boolean;
}

const SubscribeForm = () => {
  const { account, updateSubscription } = useAccount();
  const { formatMessage } = useFormat({ name: 'account' });
  const { notifyDataUpdated, notifyWentWrong } = useFeedbackToasts();
  const { discardForm } = useDiscardForm();

  const [subscribed, setSubscribed] = useState((account as AccountWithSubscription)?.isSubscribed ?? false);

  const values = ['subscribe', 'unsubscribe'];

  const handleSubmit = () => {
    updateSubscription(subscribed)
      .then(() => {
        notifyDataUpdated();
        discardForm();
      })
      .catch(() => {
        notifyWentWrong();
        discardForm();
      });
  };

  return (
    <AccountForm
      title={formatMessage({ id: 'subscribe.update', defaultMessage: 'Update Subscription' })}
      defaultCTASection
      onSubmit={handleSubmit}
    >
      <div className="mb-44 grid gap-24">
        {values.map((value, index) => (
          <div key={index} className="flex items-center gap-12">
            <input
              className="hover:cursor-pointer"
              type="radio"
              name="subscription"
              value={value}
              onChange={(e) => setSubscribed(e.target.value === 'subscribe')}
              defaultChecked={!!subscribed ? value == 'subscribe' : value == 'unsubscribe'}
            />
            <Typography as="label" fontSize={14} className="text-secondary-black">
              {formatMessage({ id: value, defaultMessage: value })}
            </Typography>
          </div>
        ))}
      </div>
    </AccountForm>
  );
};

export default SubscribeForm;
