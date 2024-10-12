export const getTalentPassportByWallet = async (address: string) => {
  if (address === '') {
    return {};
  }

  const data = await fetch(`/api/talent?address=${address}`, {
    method: 'GET',
  });

  const res = await data.json();
  const passport: TTalentPassport = res.data.passport;
  return passport;
};
