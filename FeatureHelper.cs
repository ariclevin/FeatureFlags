using Microsoft.Crm.Sdk.Messages;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cds.Common
{
    //Utility Class for Feature 
    public static class FeatureHelper
    {

        public static bool ValidateFeatureAccess(this IOrganizationService organizationService, string featureName)
        {
            string fetxhXml =
            @"<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='true' count='0'>
                <entity name='cds_mst_feature_flag' >
                    <attribute name='cds_mst_feature_flagid' />
                    <attribute name='cds_name' />
                    <order attribute='cds_name' descending='false' />
                    <filter type='and' >
                        <condition attribute='statecode' operator='eq' value='0' />
                        <condition attribute='cds_name' operator='eq' value='" + featureName + @"' />
                    </filter>
                    <link-entity name='cds_feature_access' from='cds_feature_flagid' to='cds_mst_feature_flagid' link-type='outer' alias='ad' >
                        <filter type='and' >
                            <condition attribute='ownerid' operator='eq-useroruserteams' />
                        </filter>
                    </link-entity>
                    <filter type='or' >
                        <condition attribute='cds_owner_access_required' operator='eq' value='0' />
                        <condition entityname='ad' attribute='cds_feature_accessid' operator='not-null' />
                    </filter>
                </entity>
            </fetch>";

            var results = organizationService.RetrieveMultiple(new FetchExpression(fetxhXml));
            return results.Entities.Count > 0;
        }
    }
}
