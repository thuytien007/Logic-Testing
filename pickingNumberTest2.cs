using System.Collections.Generic;
using System.Linq;
using System;

class Result
{
    /*
     * Complete the 'pickingNumbers' function below.
     *
     * The function is expected to return an INTEGER.
     * The function accepts INTEGER_ARRAY a as parameter.
     */

    public static int pickingNumbers(List<int> a)
    {
        a.Sort();
	//with 2 for loop
        //int len = a.Count;
        //int max = 0;
        //for (int i = len - 1; i >= 0; i--)
        //{
        //    int count = 1;
        //    for (int j = i - 1; j >= 0; j--)
        //    {

        //        if ((a[i] - a[j]) < 2)
        //        {
        //            count++;
        //        }
        //    }
        //    max = count > max ? count : max;
        //}
        //return max;

	//with 1 for loop
        int result = 0;
        int count = 1;
        int sub = a[0];

        for (int i = 1; i < a.Count(); i++)
        {
            if (sub == a[i] || sub + 1 == a[i])
            {
                count++;
            }
            else
            {
                if (count > result)
                {
                    result = count;
                }
                count = 1;
                sub = a[i];
            }
        }

        if (count > result)
        {
            result = count;
        }
        return result;
    }
}

class Solution
{
    public static void Main(string[] args)
    {
        //TextWriter textWriter = new StreamWriter(@System.Environment.GetEnvironmentVariable("OUTPUT_PATH"), true);

        int n = Convert.ToInt32(Console.ReadLine().Trim());

        List<int> a = Console.ReadLine().TrimEnd().Split(' ').ToList().Select(aTemp => Convert.ToInt32(aTemp)).ToList();

        int result = Result.pickingNumbers(a);

        //textWriter.WriteLine(result);

        //textWriter.Flush();
        //textWriter.Close();
        Console.WriteLine(result);
        Console.ReadLine();
    }
}