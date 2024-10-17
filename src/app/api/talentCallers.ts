export const getTalentPassportByWallet = async (address: string) => {
  if (address === '') {
    return { activity_score: 0, identity_score: 0, skills_score: 0 };
  }

  const data = await fetch(`/api/talent?address=${address}`, {
    method: 'GET',
  });

  if (data.status !== 200) {
    // Passport not found
    return {
      activity_score: 0,
      identity_score: 0,
      skills_score: 0,
    } as TTalentPassport;
  }

  const res = await data.json();

  const passport: TTalentPassport = res.data.passport;
  return passport;
};
