export const handleError = (error: any, tag?: string) => {
  const errorTag = `Error ${tag ? `: ${tag} ` : ""}`;
  if (error instanceof Error) {
    console.log(`${errorTag}: ${error.message}`);
  } else {
    console.log(`${errorTag}: Unknow Error Occured`);
  }
};
