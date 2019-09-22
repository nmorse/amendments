import { diff_match_patch } from './diff_match_patch';


const dmp = new diff_match_patch();

export const diffText = (a, b) => {
    dmp.Diff_Timeout = 1.0;
    dmp.Diff_EditCost = 4.0;
  
    var d = dmp.diff_main(a, b);
  
    // dmp.diff_cleanupSemantic(d);

    dmp.diff_cleanupEfficiency(d);
    return dmp.diff_prettyHtml(d);
  }