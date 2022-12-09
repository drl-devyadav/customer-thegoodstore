import moment from 'moment';

export const isValidPostalCode = (value: string) => Number.isInteger(Number(value)) && value.length <= 5;
export const clearSpaces = (value: string) => value.split(' ').join('');

export const getEstimationPhrase = (days: number) => {
  const estimatedDeliveryDate = moment().add(days, 'days');
  const formattedEstimatedDeliveryDate = estimatedDeliveryDate.format('DD-MM-YYYY');
  const estimationPhrase = `Est. ${formattedEstimatedDeliveryDate} to`;
  return estimationPhrase;
};